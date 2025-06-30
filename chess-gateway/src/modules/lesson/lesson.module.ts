import { Module } from '@nestjs/common';

import { NatsModule } from '../transports/nats.module';
import { BotController } from './bot.controller';
import { LessonController } from './lesson.controller';
import { LessonParentController } from './lesson-parent.controller';
import { BotRecordGameController } from './bot-record-game.controller';

@Module({
  controllers: [
    LessonController,
    LessonParentController,
    BotController,
    BotRecordGameController,
  ],
  imports: [NatsModule],
})
export class LessonModule {}
