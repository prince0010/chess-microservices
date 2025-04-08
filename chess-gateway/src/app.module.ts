import { Module } from '@nestjs/common';

import { AuthModule } from './modules/auth/auth.module';
import { HealthCheckModule } from './modules/health-check/health-check.module';
import { PandaModule } from './modules/panda/panda.module';
import { NatsModule } from './modules/transports/nats.module';
import { LessonModule } from './modules/lesson/lesson.module';

@Module({
  imports: [
    AuthModule,
    HealthCheckModule,
    NatsModule,
    LessonModule,
    PandaModule,
  ],
})
export class AppModule {}
