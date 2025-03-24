import { BadRequestException, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { DataSource } from 'typeorm';

import { Lesson } from './entities/lesson.entity';
import { parsePgnFile } from 'src/utils/pgn-parser';

import { InsertLessonDto } from './dto/insert-lesson.dto';
import { LessonLevel } from 'src/enum';

@Injectable()
export class LessonSeederService {
  constructor(private dataSource: DataSource) {}

  async insertLessons(insertLessonDto: InsertLessonDto): Promise<string> {
    const { levelName } = insertLessonDto;

    try {
      const lessonRepository = this.dataSource.getRepository(Lesson);
      let pathFile: string = '';
      if (levelName === LessonLevel.LEVEL_1) {
        pathFile = '/usr/src/app/files/lesson_level_1.pgn';
      } else {
        pathFile = 'path file missing';
      }

      // Parse PGN file
      const lessons = parsePgnFile(pathFile, levelName);

      if (lessons.length === 0) {
        throw new BadRequestException(
          'PGN Lessons file is empty. No content inside that PGN file',
        );
      }

      // Insert lessons into database
      await lessonRepository.insert(lessons);

      return 'Lessons inserted on database successfully.';
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }
}
