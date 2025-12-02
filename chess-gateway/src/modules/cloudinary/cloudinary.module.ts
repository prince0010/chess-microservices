import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { CloudinaryService } from './cloudinary.service';
import { CloudinaryProvider } from './cloudinary.provider';

@Module({
  imports: [ConfigModule],
  providers: [CloudinaryService, CloudinaryProvider],
  exports: [CloudinaryService, CloudinaryProvider],
})
export class CloudinaryModule {}
