import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { LessonService } from './lesson.service';
import { LessonSeederService } from './lesson-seeder.service';

import { FindOneLessonDto } from './dto/find-one-lesson.dto';
import { FindAllHistoryRecordLessonDto } from './dto/find-all-history-record-lesson.dto';

@Controller()
export class LessonController {
  constructor(
    private readonly lessonService: LessonService,
    private readonly lessonSeederService: LessonSeederService,
  ) {}

  @MessagePattern('lesson.insert.pgn')
  create() {
    return this.lessonSeederService.insertAllPgnFiles();
  }

  @MessagePattern('lesson.find.one')
  findOne(@Payload() findOneLessonDto: FindOneLessonDto) {
    return this.lessonService.findOne(findOneLessonDto);
  }

  @MessagePattern('lesson.find.historyRecord')
  findHistory(
    @Payload() findAllHistoryRecordLessonDto: FindAllHistoryRecordLessonDto,
  ) {
    return this.lessonService.findHistoryRecord(findAllHistoryRecordLessonDto);
  }
}
