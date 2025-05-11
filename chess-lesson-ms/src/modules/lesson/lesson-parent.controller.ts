import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { CreateLessonParentDto } from './dto/create-lesson-parent.dto';
import { LessonParentService } from './lesson-parent.service';

@Controller()
export class LessonParentController {
  constructor(private readonly lessonParentService: LessonParentService) {}

  @MessagePattern('lessonParent.create.one')
  createLessonParent(@Payload() createLessonParentDto: CreateLessonParentDto) {
    return this.lessonParentService.create(createLessonParentDto);
  }
}
