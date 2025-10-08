import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { LessonAdvancedService } from './lesson-advanced.service';
import { LessonSeederService } from './lesson-seeder.service';

import { FindAllLessonAdvancedDto } from './dto/find-all-lesson-advanced.dto';

@Controller()
export class LessonAdvancedController {
  constructor(
    private readonly lessonSeederService: LessonSeederService,
    private readonly lessonAdvancedService: LessonAdvancedService,
  ) {}

  @MessagePattern('lesson.insert.advancedPgn')
  insertAdvancedPgn() {
    return this.lessonSeederService.insertAdvancedPgnFiles();
  }

  @MessagePattern('lesson.advanced.findOne')
  findOneAdvancedLesson(@Payload() advancedLessonId: number) {
    return this.lessonAdvancedService.findOneAdvancedLessonId(advancedLessonId);
  }

  @MessagePattern('lesson.advanced.findAll')
  findAllAdvancedLessons(
    @Payload() findAllLessonAdvancedDto: FindAllLessonAdvancedDto,
  ) {
    console.log('/get-list-advanced-lessons');
    return this.lessonAdvancedService.findAllAdvancedLessons(
      findAllLessonAdvancedDto,
    );
  }
}
