import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Lesson } from './entities/lesson.entity';
import { LessonParentTestRecord } from './entities/lesson-parent-test-record.entity';

import { ILessonTestRecordListByUser } from './interfaces';
import { FindAllHistoryRecordLessonTestDto } from './dto/find-all-history-record-lesson-test.dto';

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
}
