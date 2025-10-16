import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NatsModule } from '../transports/nats.module';
import { RedisModule } from '../redis/redis.module';

import { Lesson } from './entities/lesson.entity';
import { LessonCompleted } from './entities/lesson-completed.entity';
import { LessonParent } from './entities/lesson-parent.entity';
import { LessonParentEnabled } from './entities/lesson-parent-enabled.entity';
import { LessonCompletedTest } from './entities/lesson-completed-test.entity';
import { LessonPlayed } from './entities/lesson-played.entity';
import { LessonParentTestRecord } from './entities/lesson-parent-test-record.entity';
import { LessonSingleRecord } from './entities/lesson-single-record.entity';
import { LessonAdvanced } from './entities/lesson-advanced.entity';

import { LessonController } from './lesson.controller';
import { LessonCompletedController } from './lesson-completed.controller';
import { LessonParentController } from './lesson-parent.controller';
import { LessonParentTestRecordController } from './lesson-parent-test-record.controller';
import { LessonAdvancedController } from './lesson-advanced.controller';

import { LessonCompletedService } from './lesson-completed.service';
import { LessonService } from './lesson.service';
import { LessonSeederService } from './lesson-seeder.service';
import { LessonParentService } from './lesson-parent.service';
import { LessonParentTestRecordService } from './lesson-parent-test-record.service';
import { LessonAdvancedService } from './lesson-advanced.service';

@Module({
  controllers: [
    LessonController,
    LessonCompletedController,
    LessonParentController,
    LessonParentTestRecordController,
    LessonAdvancedController,
  ],
  providers: [
    LessonService,
    LessonSeederService,
    LessonCompletedService,
    LessonParentService,
    LessonParentTestRecordService,
    LessonAdvancedService,
  ],
  imports: [
    TypeOrmModule.forFeature([
      Lesson,
      LessonCompleted,
      LessonParent,
      LessonParentEnabled,
      LessonCompletedTest,
      LessonPlayed,
      LessonParentTestRecord,
      LessonSingleRecord,
      LessonAdvanced,
    ]),
    NatsModule,
    RedisModule,
  ],
  exports: [TypeOrmModule],
})
export class LessonModule {}
