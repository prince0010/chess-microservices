import { BadRequestException, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { Lesson } from './entities/lesson.entity';
import { LessonParent } from './entities/lesson-parent.entity';
import { parseHintPgnFile, parseNormalPgnFile } from 'src/utils/pgn-parser';

import {
  GenerateLessonTestDto,
  InsertLessonDto,
} from './dto/insert-lesson.dto';
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
    const { levelName } = insertLessonDto;

    try {
      const lessonRepository = this.dataSource.getRepository(Lesson);
      let pathFile: string = '';
      // changeMe! in the future
      if (levelName === LessonLevel.LEVEL_1) {
        pathFile = '/usr/src/app/files/lesson_level_1.pgn';
      } else {
        pathFile = 'path file missing';
      }

      // Parse PGN file
      const lessons = parseNormalPgnFile(pathFile, levelName, lessonParent);

      if (lessons.length === 0) {
        throw new BadRequestException(
          'PGN Lessons file is empty. No content inside that PGN file',
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

      default:
        break;
    }

    return filename;
  }

  // TEST SEED CREATION
  async seedTestLessons(
    generateLessonTestDto: GenerateLessonTestDto,
  ): Promise<string> {
    const { levelName, testLessonsLength, lessonParentTestName } =
      generateLessonTestDto;

    try {
      // STEP 0: make sure not lesson parent duplicate
      const existsLessonParent = await this.lessonParentRepository.findOneBy({
        name: lessonParentTestName,
      });
      if (existsLessonParent) {
        throw new BadRequestException(
          `Lesson Parent with name: ${lessonParentTestName} already exists.`,
        );
      }

      // STEP 1: Get all lessons with this level
      const allLessonsByLevel = await this.lessonRepository.find({
        where: { level: levelName },
      });

      if (!allLessonsByLevel || allLessonsByLevel.length < testLessonsLength) {
        throw new BadRequestException(
          `Insufficient lessons with level "${levelName}" in database to create a test with ${testLessonsLength} lessons.`,
        );
      }

      // STEP 2: Shuffle the lessons randomly
      const shuffledLessons = allLessonsByLevel.sort(() => 0.5 - Math.random());

      // STEP 3: Pick the first N from the shuffled list
      const selectedLessons = shuffledLessons.slice(0, testLessonsLength);

      // STEP 4: Create a new LessonParent for this test
      const newLessonParentTest = this.lessonParentRepository.create({
        level: levelName,
        name: lessonParentTestName,
        showHint: selectedLessons[0].showHint,
        isTest: true,
      });

      // STEP 5: Create new Lesson entities copying values (except id and relations)
      const newLessonsArray: Lesson[] = selectedLessons.map((lesson) => {
        const newLesson = this.lessonRepository.create({
          level: lesson.level,
          description: lesson.description,
          moves: lesson.moves,
          pgnRaw: lesson.pgnRaw,
          fen: lesson.fen,
          points: lesson.points,
          event: lesson.event,
          site: lesson.site,
          date: lesson.date,
          round: lesson.round,
          white: lesson.white,
          black: lesson.black,
          result: lesson.result,
          setup: lesson.setup,
          plyCount: lesson.plyCount,
          showHint: lesson.showHint,
          hints: lesson.hints,
          // DO NOT assign lessonParent yet
        });

        return newLesson;
      });

      // STEP 6: Assign lessons to the new lesson parent
      newLessonParentTest.lessons = newLessonsArray;

      // STEP 7: Save lesson parent (TypeORM cascades will save child lessons too)
      await this.lessonParentRepository.save(newLessonParentTest);

      return `Test lesson parent with name: ${lessonParentTestName} and randomized lessons generated successfully.`;
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }
}
