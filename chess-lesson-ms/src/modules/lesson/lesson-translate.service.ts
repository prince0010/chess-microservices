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
    } catch (error) {
      console.error('translateSingleText fatal error:', error.message);
      return text;
    }
  }
}
