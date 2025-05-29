import { BadRequestException, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { Lesson } from './entities/lesson.entity';
import { LessonParent } from './entities/lesson-parent.entity';
import { parseHintPgnFile, parseNormalPgnFile } from 'src/utils/pgn-parser';

import { InsertLessonDto } from './dto/insert-lesson.dto';
import { LessonFilename, LessonLevel, LessonParentName } from 'src/enum';

@Injectable()
export class LessonSeederService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(LessonParent)
    private readonly lessonParentRepository: Repository<LessonParent>,
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
  ) {}

  async chooseTypeOfLessonsToInsert(
    insertLessonDto: InsertLessonDto,
  ): Promise<string> {
    const { levelName, lessonParentName } = insertLessonDto;
    try {
      const lessonParent = await this.lessonParentRepository.findOneBy({
        name: lessonParentName,
      });
      if (!lessonParent) {
        throw new BadRequestException(
          `Parent lesson with name: ${lessonParentName} not found.`,
        );
      }

      const result = lessonParent.showHint
        ? await this.insertHintLessons(insertLessonDto, lessonParent)
        : await this.insertNormalLessons(insertLessonDto, lessonParent);

      return result;
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  // traditional pgn files with no hint
  async insertNormalLessons(
    insertLessonDto: InsertLessonDto,
    lessonParent: LessonParent,
  ): Promise<string> {
    const { levelName, lessonParentName } = insertLessonDto;

    try {
      const lessonRepository = this.dataSource.getRepository(Lesson);

      const filename = this.getFilename(lessonParentName);
      let pathFile: string = `/usr/src/app/files/${filename}`;

      // Parse PGN file
      const lessons = parseNormalPgnFile(pathFile, levelName, lessonParent);

      if (lessons.length === 0) {
        throw new BadRequestException(
          `PGN Lessons with name: ${filename} file is empty. No content inside that PGN file`,
        );
      }

      // Insert lessons into database
      await lessonRepository.insert(lessons);

      return 'Normal lessons (with no hints) inserted on database successfully.';
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  // new pgn files of Level 1 with hints
  async insertHintLessons(
    insertLessonDto: InsertLessonDto,
    lessonParent: LessonParent,
  ): Promise<string> {
    const { levelName, lessonParentName } = insertLessonDto;

    try {
      const lessonRepository = this.dataSource.getRepository(Lesson);

      const filename = this.getFilename(lessonParentName);
      let pathFile: string = `/usr/src/app/files/${filename}`;

      // Parse PGN file
      const lessons = parseHintPgnFile(pathFile, levelName, lessonParent);

      if (lessons.length === 0) {
        throw new BadRequestException(
          'PGN Lessons file is empty. No content inside that PGN file',
        );
      }

      // Insert lessons into database
      await lessonRepository.insert(lessons);

      return 'Lessons with hints inserted on database successfully.';
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  getFilename(lessonParentName: string): string {
    let filename: string = '';

    switch (lessonParentName) {
      case LessonParentName.PAWN:
        filename = LessonFilename.PAWN;
        break;
      case LessonParentName.KING:
        filename = LessonFilename.KING;
        break;
      case LessonParentName.BISHOP:
        filename = LessonFilename.BISHOP;
        break;
      case LessonParentName.KNIGHT:
        filename = LessonFilename.KNIGHT;
        break;
      case LessonParentName.ROOK:
        filename = LessonFilename.ROOK;
        break;
      case LessonParentName.QUEEN:
        filename = LessonFilename.QUEEN;
        break;
      case LessonParentName.LEVEL_2:
        filename = LessonFilename.LEVEL_2;
        break;
      case LessonParentName.LEVEL_3:
        filename = LessonFilename.LEVEL_3;
        break;

      default:
        break;
    }

    return filename;
  }
}
