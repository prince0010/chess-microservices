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
import { LessonSingleRecord } from './entities/lesson-single-record.entity';

import { transformSingleLessons } from './helpers/transform-lesson.helper';

import { FindOneLessonDto } from './dto/find-one-lesson.dto';
import { FindAllHistoryRecordLessonDto } from './dto/find-all-history-record-lesson.dto';
import { ILessonList, ILessonListRecordByUser } from './interfaces';
import { LessonSingleRecordStatus } from 'src/enum';

@Injectable()
export class LessonService {
  constructor(
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
    @InjectRepository(LessonParent)
    private readonly lessonParentRepository: Repository<LessonParent>,
    @InjectRepository(LessonCompleted)
    private readonly lessonCompletedRepository: Repository<LessonCompleted>,
    @InjectRepository(LessonSingleRecord)
    private readonly lessonSingleRecordRepository: Repository<LessonSingleRecord>,
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

      const [singleLessonRecords, total] =
        await this.lessonSingleRecordRepository.findAndCount({
          where: { userUid, lesson: { lessonParent: { id: lessonParentId } } },
          relations: { lesson: true },
          take: limit,
          skip: offset,
        });

      return {
        total: total,
        lessons: singleLessonRecords.map((record) => ({
          lessonId: record.lesson.id,
          level: record.lesson.level,
          description: record.lesson.description,
          playedAt: record.playedAt,
          status: record.status,
        })),
      };
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  // this method is only called from LessonParentService from completeLevelsFromNormalLessons
  public async updateLessonSingleRecord(
    userUid: number,
    lessonParent: LessonParent,
    validatedLessons: Lesson[],
    failedLessonId: number | null = null,
  ): Promise<void> {
    try {
      // STEP 1: identify last lesson single record row to avoid duplicity of lessons in the same sequence first lesson - last lesson of length
      const lastRow = await this.lessonSingleRecordRepository.findOne({
        where: {
          userUid,
          lesson: { lessonParent: { id: lessonParent.id } },
          status: LessonSingleRecordStatus.SUCCEEDED,
        },
        order: { id: 'DESC' },
        relations: { lesson: true },
      });

      /*
        necessary for comparison between lastRow.lesson.id against last lesson on that parent
        if equal that means the cycle start again and player play the same completed lessons 
      */
      const lastLessonByThatParent = await this.lessonRepository.findOne({
        where: { lessonParent: { id: lessonParent.id } },
        order: { id: 'DESC' },
      });

      // STEP 2: save records, avoid use Promise.all to it, so here the order is crucial
      for (const lesson of validatedLessons) {
        if (!lastRow) {
          const newLessonSingleRecord =
            this.lessonSingleRecordRepository.create({
              lesson,
              userUid,
              status: LessonSingleRecordStatus.SUCCEEDED,
            });

          await this.lessonSingleRecordRepository.save(newLessonSingleRecord);
        } else if (
          lesson.id > lastRow.lesson.id ||
          lastRow.lesson.id === lastLessonByThatParent?.id
        ) {
          const newLessonSingleRecord =
            this.lessonSingleRecordRepository.create({
              lesson,
              userUid,
              status: LessonSingleRecordStatus.SUCCEEDED,
            });

          await this.lessonSingleRecordRepository.save(newLessonSingleRecord);
        }
      }

      // STEP: 3 save failed lesson in case
      if (failedLessonId) {
        const failedLesson = await this.lessonRepository.findOneBy({
          id: failedLessonId,
        });
        if (!failedLesson) {
          throw new BadRequestException(
            `Lesson failed with ID: ${failedLessonId} not found.`,
          );
        }

        const failedRecordRow = this.lessonSingleRecordRepository.create({
          userUid,
          lesson: failedLesson,
          status: LessonSingleRecordStatus.FAILED,
        });
        await this.lessonSingleRecordRepository.save(failedRecordRow);
      }
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }
}
