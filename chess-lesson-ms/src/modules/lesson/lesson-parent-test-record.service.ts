import { BadRequestException, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { Lesson } from './entities/lesson.entity';
import { LessonParentTestRecord } from './entities/lesson-parent-test-record.entity';

import {
  ILessonTestRecordListByUser,
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
  ) {}

  async findAllByUser(
    findAllHistoryRecordLessonTestDto: FindAllHistoryRecordLessonTestDto,
  ): Promise<ILessonTestRecordListByUser> {
    const { userUid, limit = 10, page = 1 } = findAllHistoryRecordLessonTestDto;
    const offset = (page - 1) * limit;

    try {
      const [lessonTestRecords, total] =
        await this.lessonParentTestRecordRepository.findAndCount({
          where: {
            userUid,
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
    const { userUid, recordId } = findOneLessonRecordTestDto;

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

      return {
        id: record.id,
        level: record.lessonParent.level,
        name: record.lessonParent.name,
        playedAt: record.playedAt,
        result: record.lessons.length < 7 ? 'failed' : 'passed',
        lessons: lessons.map((lesson) => ({
          ...lesson,
          moves: lesson.moves.split(' '),
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
