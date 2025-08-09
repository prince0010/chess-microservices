import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';

import { LessonParentService } from './lesson-parent.service';

import { FindAllLessonParentDto } from './dto/find-all-lesson-parent.dto';
import { CompleteLessonParentDto } from './dto/complete-lesson-parent.dto';
import { FindOneLessonParentDto } from './dto/find-one-lesson-parent.dto';

@Controller()
export class LessonParentController {
  constructor(private readonly lessonParentService: LessonParentService) {}

  @MessagePattern('lessonParent.seed.data')
  seedLessonsParents() {
    return this.lessonParentService.seedLessonsParents();
  }

  @MessagePattern('lessonParent.create.one')
  createLessonParent() {
    return 'This endpoint is not available at the moment because now exists a seed to generate all lessonParents.';
    // return this.lessonParentService.create(createLessonParentDto);
  }

  @MessagePattern('lessonParent.find.all')
  findAll(@Payload() findAllLessonParentDto: FindAllLessonParentDto) {
    return this.lessonParentService.findAll(findAllLessonParentDto);
  }

  @MessagePattern('lessonParent.find.one')
  findOne(@Payload() findOneLessonParentDto: FindOneLessonParentDto) {
    return this.lessonParentService.findOne(findOneLessonParentDto);
  }

  /*
    This endpoint only will be called from game MS and bot game
    It allow me to set some lessonParent isGame or isBot as enabled
  */
  @EventPattern('lessonParent.enable.one')
  createLessonParentEnableRowFromGameOrBotLesson(
    @Payload() data: { lessonParentName: string; userUid: number },
  ) {
    return this.lessonParentService.markAsEnabledSomeLessonParentFromGameOrBot(
      data.lessonParentName,
      data.userUid,
    );
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
