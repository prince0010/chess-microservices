import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { Lesson } from './entities/lesson.entity';
import { LessonParent } from './entities/lesson-parent.entity';
import { parseHintPgnFile, parseNormalPgnFile } from 'src/utils/pgn-parser';

@Injectable()
export class LessonSeederService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(LessonParent)
    private readonly lessonParentRepository: Repository<LessonParent>,
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
  ) {}

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
