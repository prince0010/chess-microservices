import { Module } from '@nestjs/common';

import { NatsModule } from '../transports/nats.module';
import { AuthController } from './auth.controller';
import { AuthTeacherController } from './auth-teacher.controller';
import { AppVersionController } from './app-version.controller';

@Module({
  controllers: [AuthController, AuthTeacherController, AppVersionController],
  imports: [NatsModule],
})
export class AuthModule {}
