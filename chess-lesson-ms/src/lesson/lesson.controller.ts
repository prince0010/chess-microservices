import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { LessonService } from './lesson.service';
import { LessonSeederService } from './lesson-seeder.service';
import { InsertLessonDto } from './dto/insert-lesson.dto';

@Controller()
export class LessonController {
  constructor(
    private readonly lessonService: LessonService,
    private readonly lessonSeederService: LessonSeederService,
  ) {}

  @MessagePattern('lesson.insert.pgn')
  create(@Payload() insertLessonDto: InsertLessonDto) {
    return this.lessonSeederService.insertLessons(insertLessonDto);
  }

  @MessagePattern('findAll')
  findAll() {
    return this.lessonService.findAll();
  }

  @MessagePattern('findOne')
  findOne(@Payload() id: number) {
    return this.lessonService.findOne(id);
  }
}
