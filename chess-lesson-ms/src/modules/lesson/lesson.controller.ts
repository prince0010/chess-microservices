import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { LessonService } from './lesson.service';
import { LessonSeederService } from './lesson-seeder.service';

import { InsertLessonDto } from './dto/insert-lesson.dto';
import { FindAllLessonsDto } from './dto/find-all-lessons.dto';
import { FindOneLessonDto } from './dto/find-one-lesson.dto';

@Controller()
export class LessonController {
  constructor(
    private readonly lessonService: LessonService,
    private readonly lessonSeederService: LessonSeederService,
  ) {}

  @MessagePattern('lesson.insert.pgn')
  create(@Payload() insertLessonDto: InsertLessonDto) {
    return this.lessonSeederService.chooseTypeOfLessonsToInsert(
      insertLessonDto,
    );
  }

  @MessagePattern('lesson.find.all')
  findAll(@Payload() findAllLessonsDto: FindAllLessonsDto) {
    return this.lessonService.findAll(findAllLessonsDto);
  }

  @MessagePattern('lesson.find.one')
  findOne(@Payload() findOneLessonDto: FindOneLessonDto) {
    return this.lessonService.findOne(findOneLessonDto);
  }
}
