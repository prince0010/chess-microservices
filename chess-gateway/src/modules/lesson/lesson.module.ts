import { Module } from '@nestjs/common';

import { NatsModule } from '../transports/nats.module';
import { RedisModule } from '../redis/redis.module';

import { BotController } from './bot.controller';
import { LessonController } from './lesson.controller';
import { LessonParentController } from './lesson-parent.controller';
import { BotRecordGameController } from './bot-record-game.controller';
import { LessonParentTestRecordController } from './lesson-parent-test-record.controller';

@Module({
  controllers: [
    LessonController,
    LessonParentController,
    BotController,
    BotRecordGameController,
    LessonParentTestRecordController,
  ],
  imports: [NatsModule, RedisModule],
})
export class LessonModule {}
