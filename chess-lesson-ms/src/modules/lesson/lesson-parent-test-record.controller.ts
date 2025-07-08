import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { LessonParentTestRecordService } from './lesson-parent-test-record.service';

import { FindAllHistoryRecordLessonTestDto } from './dto/find-all-history-record-lesson-test.dto';
import { FindOneLessonRecordTestDto } from './dto/find-one-lesson-record-test.dto';

@Controller()
export class LessonParentTestRecordController {
  constructor(
    private readonly lessonParentTestRecordService: LessonParentTestRecordService,
  ) {}

  @MessagePattern('lessonParent.testRecord.findAllByUser')
  findAllCompleted(
    @Payload()
    findAllHistoryRecordLessonTestDto: FindAllHistoryRecordLessonTestDto,
  ) {
    return this.lessonParentTestRecordService.findAllByUser(
      findAllHistoryRecordLessonTestDto,
    );
  }

  @MessagePattern('lessonParent.testRecord.findOneByUser')
  findOne(
    @Payload()
    findOneLessonRecordTestDto: FindOneLessonRecordTestDto,
  ) {
    return this.lessonParentTestRecordService.findOneByUser(
      findOneLessonRecordTestDto,
    );
  }
}
