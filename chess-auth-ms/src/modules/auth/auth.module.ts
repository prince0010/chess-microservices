import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NatsModule } from '../transports/nats.module';
import { PandaModule } from 'src/modules/panda/panda.module';
import { envs } from 'src/config';

import { Auth } from './entities/auth.entity';
import { AuthController } from './auth.controller';
import { AuthRankingController } from './auth-ranking.controller';
import { AuthService } from './auth.service';
import { AuthRankingService } from './auth-ranking.service';

@Module({
  controllers: [AuthController, AuthRankingController],
  providers: [AuthService, AuthRankingService],
  imports: [
    JwtModule.register({
      global: true,
      secret: envs.jwtSecret,
      signOptions: { expiresIn: '720h' }, // 1 month
    }),
    TypeOrmModule.forFeature([Auth]),
    PandaModule,
    NatsModule,
  ],
  exports: [TypeOrmModule],
})
export class AuthModule {}
