import * as crypto from 'crypto';
import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
// import axios from 'axios';

import { Lesson } from './entities/lesson.entity';
import { LessonTranslateDescription } from './entities/lesson-translate-description.entity';

import { NATS_SERVICE } from 'src/config';
import { RedisService } from '../redis/redis.service';
import { listLessonTranslateDescription } from './seed/lesson-translate-description-seed';

import { ILessonList } from './interfaces';

@Injectable()
export class LessonTranslateService {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
    private readonly redisService: RedisService,

    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,

    @InjectRepository(LessonTranslateDescription)
    private readonly lessonTranslateDescriptionRepository: Repository<LessonTranslateDescription>,
  ) {}

  public async seedManuallyTranslations(): Promise<string> {
    try {
      let counter = 0;
      const arrPromises: Promise<LessonTranslateDescription>[] = [];
      for (const description of listLessonTranslateDescription) {
        if (description.target === 'en') continue;

        const lessonWasInserted =
          await this.lessonTranslateDescriptionRepository.findOneBy({
            hashCode: description.hashCode,
            target: description.target,
          });
        if (lessonWasInserted) continue;

        const newLessonTranslateDescription =
          this.lessonTranslateDescriptionRepository.create({
            target: description.target,
            originalDescription: description.originalDescription,
            translatedDescription: description.translatedDescription,
            hashCode: description.hashCode,
          });

        arrPromises.push(
          this.lessonTranslateDescriptionRepository.save(
            newLessonTranslateDescription,
          ),
        );

        counter++;
      }

      await Promise.all(arrPromises);

      return `Lesson Translate Description list inserted. The total seeded was: ${counter}`;
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  public async seedCachedTranslations(): Promise<string> {
    const listLanguages = ['ka', 'es']; // you can extend this easily
    const BATCH_SIZE = 50; // optional batching for large datasets
    let totalTranslated = 0;

    try {
      // 1️⃣ Get unique descriptions only (to avoid duplicate API calls)
      const allLessons = await this.lessonRepository.find({
        select: ['description'],
        where: { description: Not('') },
      });

      const uniqueDescriptions = [
        ...new Set(allLessons.map((l) => l.description.trim())),
      ];

      console.log(
        `Found ${uniqueDescriptions.length} unique lesson descriptions.`,
      );

      // Process each language
      for (const language of listLanguages) {
        console.log(`\nSeeding translations for language: ${language}`);

        // Optionally batch them to reduce Google API stress
        for (let i = 0; i < uniqueDescriptions.length; i += BATCH_SIZE) {
          const batch = uniqueDescriptions.slice(i, i + BATCH_SIZE);

          // Parallelize within each batch (Promise.all)
          await Promise.all(
            batch.map(async (desc) => {
              const textHash = crypto
                .createHash('sha256')
                .update(desc.trim().toLowerCase())
                .digest('hex');

              const cacheKey = `lesson-desc-${textHash}-${language}`;
              const cached = await this.redisService.get(cacheKey);
              if (cached) return; // already cached, skip

              // Call Google Translate only if not cached
              const translated = await this.translateSingleText(
                language,
                desc,
                'en',
              );

              // If translation succeeded, store in Redis
              if (translated) {
                await this.redisService.set(
                  cacheKey,
                  translated,
                  60 * 60 * 24 * 365, // 1 year cache
                );
                totalTranslated++;
              }
            }),
          );

          // console.log(
          //   `Batch ${i / BATCH_SIZE + 1} done for ${language} (${totalTranslated} cached so far)`,
          // );
        }
      }

      return `Pre-caching done. Total cached: ${totalTranslated}`;
    } catch (error) {
      console.error('Error seeding translations:', error.message);
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  /* Transform single lessons and get description translated */
  public async transformSingleLessons(
    lessons: Lesson[],
    target: string = 'en',
  ): Promise<ILessonList[]> {
    const transformed = await Promise.all(
      lessons.map(async (lesson) => ({
        ...lesson,
        moves: lesson.moves.split(' '),
        description: await this.translateSingleText(
          target, // target language
          lesson.description, // text to translate
        ),
      })),
    );

    return transformed.sort((a, b) => a.id - b.id);
  }

  private async translateSingleText(
    target: string,
    text: string,
    source = 'en',
  ): Promise<string> {
    try {
      const disallowedDescriptions: string[] = [
        'No description available',
        '[#]',
      ];
      if (!text || target === 'en' || disallowedDescriptions.includes(text)) {
        return text;
      }

      // Normalize and hash text description
      const textHash = crypto
        .createHash('sha256')
        .update(text.trim().toLowerCase())
        .digest('hex');

      // 1. find in cache history
      const cacheKey = `lesson-puzzle-description-${textHash}-${target}`;
      const cached = await this.redisService.get(cacheKey);
      if (cached) return cached;

      // 2. find in our database
      const translatedDescriptionFromDB =
        await this.lessonTranslateDescriptionRepository.findOne({
          where: { target, hashCode: textHash },
        });

      if (translatedDescriptionFromDB) {
        await this.redisService.set(
          cacheKey,
          translatedDescriptionFromDB.translatedDescription,
          60 * 60 * 24,
        );

        return translatedDescriptionFromDB.translatedDescription;
      }

      return text;
      // NO MORE USED GOOGLE API TRANSLATIONS
      // 3. try Google Translate API up to 3 times
      // const apiKey = envs.translationApiKey;
      // const baseGoogleApiUrl =
      //   'https://translation.googleapis.com/language/translate/v2';

      // if (!apiKey) {
      //   throw new BadRequestException(
      //     'Google Translate API key not configured',
      //   );
      // }

      // let translatedText: string | null = null;
      // const maxTries = 3;

      // for (let attempt = 1; attempt <= maxTries; attempt++) {
      //   try {
      //     const response = await axios.post(
      //       `${baseGoogleApiUrl}?key=${apiKey}`,
      //       {
      //         q: text,
      //         target,
      //         source,
      //         format: 'text',
      //       },
      //       { timeout: 5000 }, // 5s timeout each try
      //     );

      //     translatedText =
      //       response.data?.data?.translations?.[0]?.translatedText;
      //     if (translatedText) break; // success, stop retry loop
      //   } catch (err) {
      //     console.warn(
      //       `Google translation attempt ${attempt} failed on text: ${text}`,
      //       err.message,
      //     );
      //     // Small delay before next try (0.5s)
      //     await new Promise((res) => setTimeout(res, 500));
      //   }
      // }

      // 4. Fallback if still failed after all tries
      // if (!translatedText) {
      //   console.error(
      //     'Translation failed after 3 attempts, returning original text.',
      //   );

      //   return text; // don’t throw — return English text instead
      // }
    } catch (error) {
      // Only fatal if something is fundamentally wrong (not transient)
      console.error('translateSingleText fatal error:', error.message);
      return text;
    }
  }
}
