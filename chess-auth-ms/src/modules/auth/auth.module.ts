import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NatsModule } from '../transports/nats.module';
import { PandaModule } from 'src/modules/panda/panda.module';
import { envs } from 'src/config';

import { Auth } from './entities/auth.entity';
import { AuthStoryUnlocked } from './entities/auth-story-unlocked.entity';
import { AuthController } from './auth.controller';
import { AuthRankingController } from './auth-ranking.controller';
import { AuthStoryUnlockedController } from './auth-story-unlocked.controller';
import { AuthService } from './auth.service';
import { AuthRankingService } from './auth-ranking.service';
import { AuthStoryUnlockedService } from './auth-story-unlocked.service';

@Module({
  controllers: [
    AuthController,
    AuthRankingController,
    AuthStoryUnlockedController,
  ],
  providers: [AuthService, AuthRankingService, AuthStoryUnlockedService],
  imports: [
    JwtModule.register({
      global: true,
      secret: envs.jwtSecret,
      signOptions: { expiresIn: '720h' }, // 1 month
    }),
    TypeOrmModule.forFeature([Auth, AuthStoryUnlocked]),
    PandaModule,
    NatsModule,
  ],
  exports: [TypeOrmModule],
})
export class AuthModule {}
