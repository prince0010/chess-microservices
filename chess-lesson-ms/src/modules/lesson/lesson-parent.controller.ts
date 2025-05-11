import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { LessonParentService } from './lesson-parent.service';

import { CreateLessonParentDto } from './dto/create-lesson-parent.dto';
import { FindAllLessonParentDto } from './dto/find-all-lesson-parent.dto';
import { CompleteLessonParentDto } from './dto/complete-lesson-parent.dto';
import { FindOneLessonParentDto } from './dto/find-one-lesson-parent.dto';

@Controller()
export class LessonParentController {
  constructor(private readonly lessonParentService: LessonParentService) {}

  @MessagePattern('lessonParent.create.one')
  createLessonParent(@Payload() createLessonParentDto: CreateLessonParentDto) {
    return this.lessonParentService.create(createLessonParentDto);
  }

  @MessagePattern('lessonParent.find.all')
  findAll(@Payload() findAllLessonParentDto: FindAllLessonParentDto) {
    return this.lessonParentService.findAll(findAllLessonParentDto);
  }

  @MessagePattern('lessonParent.find.one')
  findOne(@Payload() findOneLessonParentDto: FindOneLessonParentDto) {
    return this.lessonParentService.findOne(findOneLessonParentDto);
  }

  @MessagePattern('lessonParent.update.lessonsCompleted')
  updateLessonsCompleted(
    @Payload() completeLessonParentDto: CompleteLessonParentDto,
  ) {
    return this.lessonParentService.updateLessonsCompleted(
      completeLessonParentDto,
    );
  }
}
