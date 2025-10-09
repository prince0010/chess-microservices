import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { Lesson } from './entities/lesson.entity';
import { LessonParent } from './entities/lesson-parent.entity';
import { LessonAdvanced } from './entities/lesson-advanced.entity';
import { parseHintPgnFile, parseNormalPgnFile } from 'src/utils/pgn-parser';
import { parseAdvancedPgnFile } from 'src/utils/pgn-advanced-parser';
import { lessonAdvancedFilenames } from './seed/lesson-advanced-data-seed';

@Injectable()
export class LessonSeederService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(LessonParent)
    private readonly lessonParentRepository: Repository<LessonParent>,
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
    @InjectRepository(LessonAdvanced)
    private readonly lessonAdvancedRepository: Repository<LessonAdvanced>,
  ) {}

  async insertAdvancedPgnFiles(): Promise<string> {
    try {
      const insertedFilenamesArr: string[] = [];
      for (const filename of lessonAdvancedFilenames) {
        const existingLessonAdvanced =
          await this.lessonAdvancedRepository.findOneBy({ filename });

        if (existingLessonAdvanced) continue;

        await this.insertAdvancedLessons(filename);

        insertedFilenamesArr.push(filename);
      }

      return `These advanced pgn filenames were inserted: [${insertedFilenamesArr.join(', ')}]`;
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  async insertAllPgnFiles(): Promise<string> {
    try {
      const lessonsParents = await this.lessonParentRepository.find({
        where: {},
      });

      const insertedFilenamesArr: string[] = [];
      for (const lessonParent of lessonsParents) {
        // avoid duplicate insertion of PGN lessons
        const existLessonsByThatParent = await this.lessonRepository.findOne({
          where: { lessonParent: { id: lessonParent.id } },
          relations: { lessonParent: true },
        });

        if (
          existLessonsByThatParent ||
          lessonParent.isTest ||
          lessonParent.isBot ||
          lessonParent.isGame
        ) {
          continue;
        }

        lessonParent.showHint
          ? await this.insertHintLessons(lessonParent)
          : await this.insertNormalLessons(lessonParent);

        insertedFilenamesArr.push(lessonParent.pgnFilename!);
      }

      return `These pgn filenames were inserted: [${insertedFilenamesArr.join(', ')}]`;
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  // advanced pgn files for teachers coaches
  async insertAdvancedLessons(filename: string): Promise<void> {
    try {
      const lessonAdvancedRepository =
        this.dataSource.getRepository(LessonAdvanced);

      let pathFile: string = `/usr/src/app/files/${filename}`;

      // Parse advanced PGN file
      const lessons = parseAdvancedPgnFile(filename, pathFile);

      if (lessons.length === 0) {
        console.error(
          `PGN file with name: ${filename} is empty. No content inside that PGN file`,
        );
      }

      // Insert advanced lessons into database
      await lessonAdvancedRepository.insert(lessons);
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  // traditional pgn files with no hint
  async insertNormalLessons(lessonParent: LessonParent): Promise<void> {
    try {
      const lessonRepository = this.dataSource.getRepository(Lesson);

      let pathFile: string = `/usr/src/app/files/${lessonParent.pgnFilename}`;

      // Parse PGN file
      const lessons = parseNormalPgnFile(pathFile, lessonParent);

      if (lessons.length === 0) {
        console.error(
          `PGN file with name: ${lessonParent.pgnFilename} is empty. No content inside that PGN file`,
        );
      }

      // Insert lessons into database
      await lessonRepository.insert(lessons);
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  // new pgn files of Level 1 with hints
  async insertHintLessons(lessonParent: LessonParent): Promise<void> {
    try {
      const lessonRepository = this.dataSource.getRepository(Lesson);

      let pathFile: string = `/usr/src/app/files/${lessonParent.pgnFilename}`;

      // Parse PGN file
      const lessons = parseHintPgnFile(pathFile, lessonParent);

      if (lessons.length === 0) {
        console.error(
          `PGN ${lessonParent.pgnFilename} file is empty. No content inside that PGN file`,
        );
      }

      // Insert lessons into database
      await lessonRepository.insert(lessons);
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }
}
