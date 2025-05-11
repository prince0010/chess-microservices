import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { LessonCompletedService } from './lesson-completed.service';

import { UserUidDto } from './dto/complete-lesson-parent.dto';

@Controller()
export class LessonCompletedController {
  constructor(
    private readonly lessonCompletedService: LessonCompletedService,
  ) {}

  @MessagePattern('lesson.complete.findAllByUser')
  findAllCompleted(@Payload() userUidDto: UserUidDto) {
    return this.lessonCompletedService.findAllByUser(+userUidDto.userUid);
  }
}
