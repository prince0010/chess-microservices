import { Module } from '@nestjs/common';

import { NatsModule } from '../transports/nats.module';
import { BotController } from './bot.controller';
import { LessonController } from './lesson.controller';
import { LessonParentController } from './lesson-parent.controller';

@Module({
  controllers: [LessonController, LessonParentController, BotController],
  imports: [NatsModule],
})
export class LessonModule {}
