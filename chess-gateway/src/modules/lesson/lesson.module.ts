import { Module } from '@nestjs/common';

import { NatsModule } from '../transports/nats.module';
import { LessonController } from './lesson.controller';

@Module({
  controllers: [LessonController],
  imports: [NatsModule],
})
export class LessonModule {}
