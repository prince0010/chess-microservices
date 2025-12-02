import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { CloudinaryProvider } from './cloudinary.provider';
import { CloudinaryService } from './cloudinary.service';
import { UploadService } from './upload.service';

@Module({
  imports: [ConfigModule],
  providers: [CloudinaryService, CloudinaryProvider, UploadService],
  exports: [CloudinaryService, CloudinaryProvider, UploadService],
})
export class CloudinaryModule {}
