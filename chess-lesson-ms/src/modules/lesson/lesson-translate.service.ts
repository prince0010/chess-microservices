import * as crypto from 'crypto';
import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import axios from 'axios';

import { Lesson } from './entities/lesson.entity';

import { envs, NATS_SERVICE } from 'src/config';
import { RedisService } from '../redis/redis.service';

import { ILessonList } from './interfaces';

@Injectable()
export class LessonTranslateService {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
    private readonly redisService: RedisService,
  ) {}

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
      if (target === 'en' || disallowedDescriptions.includes(text)) {
        return text;
      }

      const apiKey = envs.translationApiKey;
      const baseGoogleApiUrl =
        'https://translation.googleapis.com/language/translate/v2';

      if (!apiKey) {
        throw new RpcException({
          status: 500,
          message: 'Google Translate API key not configured',
        });
      }

      // 1. Normalize and hash the text to avoid duplicate caching
      const textHash = crypto
        .createHash('sha256')
        .update(text.trim().toLowerCase())
        .digest('hex');

      const cacheKey = `lesson-desc-${textHash}-${target}`;

      // 2. Try to get cached translation
      const cached = await this.redisService.get(cacheKey);
      if (cached) return cached;

      // 3. Fetch translation from Google API
      const response = await axios.post(`${baseGoogleApiUrl}?key=${apiKey}`, {
        q: text,
        target,
        source,
        format: 'text',
      });

      const translatedText =
        response.data?.data?.translations?.[0]?.translatedText;

      if (!translatedText) {
        throw new BadRequestException(
          'Failed to get translation from Google API',
        );
      }

      // 4. Cache by hash (for reuse across lessons)
      await this.redisService.set(cacheKey, translatedText, 60 * 60 * 24 * 365); // 365 days cache

      return translatedText;
    } catch (error) {
      throw new RpcException({
        status: 400,
        message:
          error.response?.data?.error?.message ||
          error.message ||
          'Translation failed',
      });
    }
  }
}

// private async translateSingleText(
//   target: string,
//   text: string,
//   source = 'en',
// ): Promise<string> {
//   try {
//     const disallowedDescriptions: string[] = ['No description available', '[#]'];
//     if (target === 'en' || disallowedDescriptions.includes(text)) {
//       return text;
//     }

//     const apiKey = envs.translationApiKey;
//     const baseGoogleApiUrl =
//       'https://translation.googleapis.com/language/translate/v2';

//     if (!apiKey) {
//       throw new RpcException({
//         status: 500,
//         message: 'Google Translate API key not configured',
//       });
//     }

//     // 1️⃣ Normalize and hash text to cache by meaning
//     const textHash = crypto
//       .createHash('sha256')
//       .update(text.trim().toLowerCase())
//       .digest('hex');

//     const cacheKey = `lesson-desc-${textHash}-${target}`;

//     // 2️⃣ Return cached translation if available
//     const cached = await this.redisService.get(cacheKey);
//     if (cached) return cached;

//     // 3️⃣ Try Google Translate API up to 3 times
//     let translatedText: string | null = null;
//     const maxTries = 3;

//     for (let attempt = 1; attempt <= maxTries; attempt++) {
//       try {
//         const response = await axios.post(
//           `${baseGoogleApiUrl}?key=${apiKey}`,
//           {
//             q: text,
//             target,
//             source,
//             format: 'text',
//           },
//           { timeout: 10000 }, // 10s timeout each try
//         );

//         translatedText = response.data?.data?.translations?.[0]?.translatedText;
//         if (translatedText) break; // ✅ success, stop retry loop
//       } catch (err) {
//         console.warn(
//           `Google translation attempt ${attempt} failed:`,
//           err.message,
//         );
//         // Small delay before next try (0.5s)
//         await new Promise((res) => setTimeout(res, 500));
//       }
//     }

//     // 4️⃣ Fallback if still failed after all tries
//     if (!translatedText) {
//       console.error('Translation failed after 3 attempts, returning original text.');
//       return text; // don’t throw — return English text instead
//     }

//     // 5️⃣ Cache result for 1 year
//     await this.redisService.set(cacheKey, translatedText, 60 * 60 * 24 * 365);

//     return translatedText;
//   } catch (error) {
//     // Only fatal if something is fundamentally wrong (not transient)
//     console.error('translateSingleText fatal error:', error.message);
//     return text;
//   }
// }
