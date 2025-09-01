import { Module } from '@nestjs/common';

import { NatsModule } from '../transports/nats.module';
import { AuthController } from './auth.controller';
import { AuthTeacherController } from './auth-teacher.controller';

@Module({
  controllers: [AuthController, AuthTeacherController],
  imports: [NatsModule],
})
export class AuthModule {}
