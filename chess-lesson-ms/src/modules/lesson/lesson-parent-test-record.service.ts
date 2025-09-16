import { BadRequestException, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { Lesson } from './entities/lesson.entity';
import { LessonParent } from './entities/lesson-parent.entity';
import { LessonParentTestRecord } from './entities/lesson-parent-test-record.entity';

import {
  ILessonTestRecordListByUser,
  ISingleChildLessonPuzzle,
  ISingleLessonTestRecord,
} from './interfaces';
import { FindAllHistoryRecordLessonTestDto } from './dto/find-all-history-record-lesson-test.dto';
import { FindOneLessonRecordTestDto } from './dto/find-one-lesson-record-test.dto';

@Injectable()
export class LessonParentTestRecordService {
  constructor(
    @InjectRepository(LessonParentTestRecord)
    private readonly lessonParentTestRecordRepository: Repository<LessonParentTestRecord>,
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
    @InjectRepository(LessonParent)
    private readonly lessonParentRepository: Repository<LessonParent>,
  ) {}

  async findAllByUser(
    findAllHistoryRecordLessonTestDto: FindAllHistoryRecordLessonTestDto,
  ): Promise<ILessonTestRecordListByUser> {
    const {
      userUid: userAuthenticatedUid,
      lessonParentId,
      limit = 10,
      page = 1,
      studentUid = null,
    } = findAllHistoryRecordLessonTestDto;

    const offset = (page - 1) * limit;
    const userUid = studentUid ?? userAuthenticatedUid;

    try {
      const existingLessonParent = await this.lessonParentRepository.findOneBy({
        id: lessonParentId,
      });
      if (!existingLessonParent) {
        throw new BadRequestException(
          `Lesson Parent with ID: ${lessonParentId} not found.`,
        );
      }

      const [lessonTestRecords, total] =
        await this.lessonParentTestRecordRepository.findAndCount({
          where: {
            userUid,
            lessonParent: { id: lessonParentId },
          },
          relations: { lessonParent: true },
          take: limit,
          skip: offset,
          order: { id: 'DESC' },
        });

      const records = lessonTestRecords.map((lessonTestRecord) => ({
        id: lessonTestRecord.id,
        level: lessonTestRecord.lessonParent.level,
        name: lessonTestRecord.lessonParent.name,
        playedAt: lessonTestRecord.playedAt,
        lessonIds: lessonTestRecord.lessons,
        result: lessonTestRecord.lessons.length < 7 ? 'failed' : 'passed',
      }));

      return {
        total,
        page,
        records,
      };
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  async findOneByUser(
    findOneLessonRecordTestDto: FindOneLessonRecordTestDto,
  ): Promise<ISingleLessonTestRecord> {
    const {
      userUid: userAuthenticatedUid,
      recordId,
      studentUid = null,
    } = findOneLessonRecordTestDto;

    const userUid = studentUid ?? userAuthenticatedUid;

    try {
      const record = await this.lessonParentTestRecordRepository.findOne({
        where: {
          id: recordId,
          userUid,
        },
        relations: { lessonParent: true },
      });

      if (!record) {
        throw new BadRequestException(
          `Lesson Test Record with ID: ${recordId} not found.`,
        );
      }

      const lessons = await this.lessonRepository.find({
        where: { id: In(record.lessons.map((lessonId) => +lessonId)) },
      });

      const transformedLessons: ISingleChildLessonPuzzle[] = lessons.map(
        (lesson) => ({
          ...lesson,
          moves: lesson.moves.split(' '),
          isFailure: false,
        }),
      );

      // STEP verify if some failedLesson exists
      let failedLesson: Lesson | null = null;
      if (record.failedLessonId) {
        const existsLessonFailed = await this.lessonRepository.findOneBy({
          id: record.failedLessonId,
        });
        if (!existsLessonFailed) {
          throw new BadRequestException(
            `Failed lesson with ID: ${record.failedLessonId} not found at find one lesson test record endpoint.`,
          );
        }

        failedLesson = existsLessonFailed;
      }

      if (failedLesson) {
        transformedLessons.push({
          ...failedLesson,
          moves: failedLesson.moves.split(' '),
          isFailure: true,
        });
      }

      return {
        id: record.id,
        level: record.lessonParent.level,
        name: record.lessonParent.name,
        playedAt: record.playedAt,
        result: record.lessons.length < 7 ? 'failed' : 'passed',
        lessons: transformedLessons,
      };
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }
}
