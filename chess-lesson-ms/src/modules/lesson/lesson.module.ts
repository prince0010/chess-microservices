import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Lesson } from './entities/lesson.entity';
import { LessonCompleted } from './entities/lesson-completed.entity';

import { LessonController } from './lesson.controller';
import { LessonCompletedController } from './lesson-completed.controller';
import { LessonCompletedService } from './lesson-completed.service';
import { LessonService } from './lesson.service';
import { LessonSeederService } from './lesson-seeder.service';

@Module({
  controllers: [LessonController, LessonCompletedController],
  providers: [LessonService, LessonSeederService, LessonCompletedService],
  imports: [TypeOrmModule.forFeature([Lesson, LessonCompleted])],
  exports: [TypeOrmModule],
})
export class LessonModule {}
