import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { FindManyOptions, Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { NATS_SERVICE } from 'src/config';
import { LessonAdvanced } from './entities/lesson-advanced.entity';

import { ICountAndListAdvancedLessons } from './interfaces';
import { FindAllLessonAdvancedDto } from './dto/find-all-lesson-advanced.dto';

@Injectable()
export class LessonAdvancedService {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
    @InjectRepository(LessonAdvanced)
    private readonly lessonAdvancedRepository: Repository<LessonAdvanced>,
  ) {}

  async findAllAdvancedLessons(
    findAllLessonAdvancedDto: FindAllLessonAdvancedDto,
  ): Promise<ICountAndListAdvancedLessons> {
    const {
      limit = 10,
      page = 1,
      folder = null,
      description = null,
    } = findAllLessonAdvancedDto;

    const offset = (page - 1) * limit;

    const findOptions: FindManyOptions<LessonAdvanced> = {
      take: limit,
      skip: offset,
      order: {
        id: 'ASC',
      },
    };

    const whereConditions: any = {};

    if (folder) {
      whereConditions.folder = folder;
    }

    if (description) {
      whereConditions.description = Like(`%${description}%`);
    }

    if (Object.keys(whereConditions).length > 0) {
      findOptions.where = whereConditions;
    }

    try {
      const [advancedLessons, total] =
        await this.lessonAdvancedRepository.findAndCount(findOptions);

      const filteredLessons = advancedLessons.map((lesson) => {
        const { movesTree, ...restLesson } = lesson;
        return { ...restLesson };
      });

      return {
        total,
        page,
        advancedLessons: filteredLessons,
      };
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  async findOneAdvancedLessonId(
    advancedLessonId: number,
  ): Promise<LessonAdvanced> {
    try {
      const advancedLesson = await this.lessonAdvancedRepository.findOneBy({
        id: advancedLessonId,
      });

      if (!advancedLesson) {
        throw new BadRequestException(
          `Advanced Lesson with ID: ${advancedLessonId} not found`,
        );
      }

      // ✅ Parse metadata and movesTree safely
      const metadata =
        typeof advancedLesson.metadata === 'string'
          ? JSON.parse(advancedLesson.metadata)
          : advancedLesson.metadata;

      const movesTree =
        typeof advancedLesson.movesTree === 'string'
          ? JSON.parse(advancedLesson.movesTree)
          : advancedLesson.movesTree;

      // // ✅ Define your recursive function
      // const maxDepth = (node: any, depth = 1): number =>
      //   node?.variations?.length
      //     ? Math.max(
      //         ...node.variations.map((v: any[]) =>
      //           Math.max(...v.map((m: any) => maxDepth(m, depth + 1))),
      //         ),
      //       )
      //     : depth;

      // // ✅ Compute and log max variation depth (only if movesTree exists)
      // if (Array.isArray(movesTree) && movesTree.length > 0) {
      //   const maxVariationDepth = Math.max(
      //     ...movesTree.map((m: any) => maxDepth(m)),
      //   );
      //   console.log('🧩 Max variation depth:', maxVariationDepth);
      // } else {
      //   console.log('⚠️ No movesTree data available to compute depth');
      // }

      // ✅ Return the structured lesson
      return {
        ...advancedLesson,
        metadata,
        movesTree,
      };
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }
}
