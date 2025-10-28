import { join } from 'path';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ThrottlerModule } from '@nestjs/throttler';

import { AuthModule } from './modules/auth/auth.module';
import { HealthCheckModule } from './modules/health-check/health-check.module';
import { PandaModule } from './modules/panda/panda.module';
import { NatsModule } from './modules/transports/nats.module';
import { LessonModule } from './modules/lesson/lesson.module';
import { GameModule } from './modules/game/game.module';
import { RedisModule } from './modules/redis/redis.module';
import { PaymentModule } from './modules/payment/payment.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '/public'),
    }),

    // API Rate Limiting
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60, // 1 minute
          limit: 120, // 120 requests per minute per user
        },
      ],
    }),

    AuthModule,
    HealthCheckModule,
    NatsModule,
    LessonModule,
    PandaModule,
    GameModule,
    RedisModule,
    PaymentModule,
  ],
})
export class AppModule {}
