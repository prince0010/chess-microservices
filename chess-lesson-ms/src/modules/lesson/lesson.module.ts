import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NatsModule } from '../transports/nats.module';

import { Lesson } from './entities/lesson.entity';
import { LessonCompleted } from './entities/lesson-completed.entity';
import { LessonParent } from './entities/lesson-parent.entity';

import { LessonController } from './lesson.controller';
import { LessonCompletedController } from './lesson-completed.controller';
import { LessonParentController } from './lesson-parent.controller';
import { LessonCompletedService } from './lesson-completed.service';
import { LessonService } from './lesson.service';
import { LessonSeederService } from './lesson-seeder.service';
import { LessonParentService } from './lesson-parent.service';

@Module({
  controllers: [
    LessonController,
    LessonCompletedController,
    LessonParentController,
  ],
  providers: [
    LessonService,
    LessonSeederService,
    LessonCompletedService,
    LessonParentService,
  ],
  imports: [
    TypeOrmModule.forFeature([Lesson, LessonCompleted, LessonParent]),
    NatsModule,
  ],
  exports: [TypeOrmModule],
})
export class LessonModule {}
