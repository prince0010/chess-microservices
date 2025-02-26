import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Lesson } from './entities/lesson.entity';
import { LessonController } from './lesson.controller';
import { LessonService } from './lesson.service';
import { LessonSeederService } from './lesson-seeder.service';

@Module({
  controllers: [LessonController],
  providers: [LessonService, LessonSeederService],
  imports: [TypeOrmModule.forFeature([Lesson])],
  exports: [TypeOrmModule],
})
export class LessonModule {}
