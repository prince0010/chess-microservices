import { Module } from '@nestjs/common';

import { NatsModule } from '../transports/nats.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { AuthController } from './auth.controller';
import { AuthTeacherController } from './auth-teacher.controller';
import { AppVersionController } from './app-version.controller';
import { CoachController } from './coach.controller';
import { CoachCloudinaryService } from './coach-cloudinary.service';

@Module({
  controllers: [
    AuthController,
    AuthTeacherController,
    AppVersionController,
    CoachController,
  ],
  imports: [NatsModule, CloudinaryModule],
  providers: [CoachCloudinaryService],
})
export class AuthModule {}
