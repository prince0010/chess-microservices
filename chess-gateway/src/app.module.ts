import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { AuthModule } from './modules/auth/auth.module';
import { HealthCheckModule } from './modules/health-check/health-check.module';
import { PandaModule } from './modules/panda/panda.module';
import { NatsModule } from './modules/transports/nats.module';
import { LessonModule } from './modules/lesson/lesson.module';
import { GameModule } from './modules/game/game.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '/public'),
    }),

    AuthModule,
    HealthCheckModule,
    NatsModule,
    LessonModule,
    PandaModule,
    GameModule,
  ],
})
export class AppModule {}
