import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Lesson } from './entities/lesson.entity';
import { LessonParent } from './entities/lesson-parent.entity';
import { LessonCompleted } from './entities/lesson-completed.entity';

import { transformSingleLessons } from './helpers/transform-lesson.helper';

import { FindOneLessonDto } from './dto/find-one-lesson.dto';
import { FindAllHistoryRecordLessonDto } from './dto/find-all-history-record-lesson.dto';
import { ILessonList, ILessonListRecordByUser } from './interfaces';

@Injectable()
export class LessonService {
  constructor(
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
    @InjectRepository(LessonParent)
    private readonly lessonParentRepository: Repository<LessonParent>,
    @InjectRepository(LessonCompleted)
    private readonly lessonCompletedRepository: Repository<LessonCompleted>,
  ) {}

  async findOne(findOneLessonDto: FindOneLessonDto): Promise<ILessonList> {
    const { lessonId, userUid } = findOneLessonDto;

    try {
      const lessonById = await this.lessonRepository.findOne({
        where: { id: lessonId },
      });
      if (!lessonById) {
        throw new NotFoundException(`Lesson by ID: ${lessonId} not found.`);
      }

      return transformSingleLessons([lessonById])[0];
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  async findHistoryRecord(
    findAllHistoryRecordLessonDto: FindAllHistoryRecordLessonDto,
  ): Promise<ILessonListRecordByUser> {
    const {
      userUid,
      limit = 10,
      page = 1,
      lessonParentId,
      // level = null,
    } = findAllHistoryRecordLessonDto;

    const offset = (page - 1) * limit;

    try {
      // STEP 0: verify lessonParent exists
      const existingLessonParent = await this.lessonParentRepository.findOneBy({
        id: lessonParentId,
      });
      if (!existingLessonParent) {
        throw new BadRequestException(
          `Lesson Parent with ID: ${lessonParentId} not found.`,
        );
      }

      // STEP 1: build the SQL
      const [rawLessons, total] = await Promise.all([
        this.lessonCompletedRepository.query(
          `
            SELECT
              lesson.id,
              lesson.level,
              lesson.description,
              lesson_completed.completedAt,
              lesson_parent.levelFrontend
            FROM
              lesson_completed
            JOIN
              lesson ON lesson_completed.lessonId = lesson.id
            JOIN
              lesson_parent ON lesson.lessonParentId = lesson_parent.id
            WHERE
              lesson_completed.userUid = ? AND lesson_parent.id = ?
            ORDER BY
              lesson.level ASC,
              lesson.id ASC
            LIMIT ? OFFSET ?
          `,
          [userUid, lessonParentId, limit, offset],
        ),
        this.lessonCompletedRepository.query(
          `
            SELECT COUNT(*) as total
            FROM lesson_completed
            JOIN lesson ON lesson_completed.lessonId = lesson.id
            JOIN lesson_parent ON lesson.lessonParentId = lesson_parent.id
            WHERE lesson_completed.userUid = ? AND lesson_parent.id = ?
          `,
          [userUid, lessonParentId],
        ),
      ]);

      return {
        total: Number(total[0].total),
        lessons: rawLessons.map((lesson) => ({
          lessonId: lesson.id,
          level: lesson.levelFrontend,
          description: lesson.description,
          completedAt: lesson.completedAt,
        })),
      };
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }
}
