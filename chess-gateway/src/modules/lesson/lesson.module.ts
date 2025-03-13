import { Module } from '@nestjs/common';

import { NatsModule } from '../transports/nats.module';
import { BotController } from './bot.controller';
import { LessonController } from './lesson.controller';

@Module({
  controllers: [LessonController, BotController],
  imports: [NatsModule],
})
export class LessonModule {}
