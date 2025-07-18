import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, MoreThan, Repository } from 'typeorm';
import { firstValueFrom } from 'rxjs';

import { NATS_SERVICE } from 'src/config';
import { Lesson } from './entities/lesson.entity';
import { LessonParent } from './entities/lesson-parent.entity';
import { LessonParentEnabled } from './entities/lesson-parent-enabled.entity';
import { LessonCompleted } from './entities/lesson-completed.entity';
import { LessonCompletedTest } from './entities/lesson-completed-test.entity';
import { LessonPlayed } from './entities/lesson-played.entity';
import { LessonParentTestRecord } from './entities/lesson-parent-test-record.entity';

import { transformSingleLessons } from './helpers/transform-lesson.helper';
import { someLessonDuplicates } from './helpers/duplicate-lesson.helper';
import { getTestLessonLengthByLevel } from './helpers/get-test-lesson-length-by-level.helper';
import { shuffleRandomLessons } from './helpers/shuffle-random-lessons.helper';
import { getFactorLesson } from './helpers/factor-lesson.helper';
import { typeUserCounterByStoryLesson } from 'src/utils/type-user-counter-by-story-lesson';

import { CreateLessonParentDto } from './dto/create-lesson-parent.dto';
import { FindAllLessonParentDto } from './dto/find-all-lesson-parent.dto';
import { CompleteLessonParentDto } from './dto/complete-lesson-parent.dto';
import { FindOneLessonParentDto } from './dto/find-one-lesson-parent.dto';
import { UpdateUserPointsDto } from './dto/update-user-points.dto';

import {
  CompleteLessonResponse,
  ICountAndListLessonParents,
  ILessonParent,
  ILessonParentDetail,
} from './interfaces';
import { LessonLevel, LessonParentName, LessonStoryName } from 'src/enum';

@Injectable()
export class LessonParentService {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
    @InjectRepository(LessonCompleted)
    private readonly lessonCompletedRepository: Repository<LessonCompleted>,
    @InjectRepository(LessonCompletedTest)
    private readonly lessonCompletedTestRepository: Repository<LessonCompletedTest>,
    @InjectRepository(LessonParent)
    private readonly lessonParentRepository: Repository<LessonParent>,
    @InjectRepository(LessonParentEnabled)
    private readonly lessonParentEnabledRepository: Repository<LessonParentEnabled>,
    @InjectRepository(LessonPlayed)
    private readonly lessonPlayedRepository: Repository<LessonPlayed>,
    @InjectRepository(LessonParentTestRecord)
    private readonly lessonParentTestRecordRepository: Repository<LessonParentTestRecord>,
  ) {}

  async create(
    createLessonParentDto: CreateLessonParentDto,
  ): Promise<LessonParent> {
    const { level, name, story, showHint } = createLessonParentDto;

    try {
      const newLessonParent: LessonParent = this.lessonParentRepository.create({
        ...createLessonParentDto,
      });

      return await this.lessonParentRepository.save(newLessonParent);
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  async findOne(
    findOneLessonParentDto: FindOneLessonParentDto,
  ): Promise<ILessonParentDetail> {
    const { userUid, lessonParentId } = findOneLessonParentDto;
    try {
      const lessonParent = await this.lessonParentRepository.findOne({
        where: { id: lessonParentId },
        relations: { lessons: true },
      });
      if (!lessonParent) {
        throw new BadRequestException(
          `Lesson parent with ID: ${lessonParentId} not found`,
        );
      }

      // if the lesson is test it is required to return random lessons
      if (lessonParent.isTest) {
        return await this.selectRandomTestLessonsByLevel(lessonParent, userUid);
      }

      const { lessonsLength, lessonsCompleted } =
        await this.getLessonsLengthAndTotalCompleted(lessonParent, userUid);

      const lastLessonPlayedId = await this.lessonPlayedRepository.findOne({
        where: { userUid, lessonParent: { id: lessonParent.id } },
      });

      const result: ILessonParentDetail = {
        id: lessonParent.id,
        level: lessonParent.level,
        name: lessonParent.name,
        story: lessonParent.story,
        showHint: lessonParent.showHint,
        isTest: lessonParent.isTest,
        lessonsLength,
        lessonsCompleted,
        lastLessonPlayedId:
          lastLessonPlayedId?.lastLessonPlayed ??
          lessonParent.lessons[0].id - 1,
        lessons: transformSingleLessons(lessonParent.lessons),
      };

      return result;
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  private async selectRandomTestLessonsByLevel(
    lessonParent: LessonParent,
    userUid: number,
  ): Promise<ILessonParentDetail> {
    try {
      // STEP 0: Get test lesson length by level
      const length = getTestLessonLengthByLevel(
        lessonParent.level as LessonLevel,
      );

      // STEP 1: Get all lessons with this level
      const allLessonsByLevel = await this.lessonRepository.find({
        where: { level: lessonParent.level },
      });

      if (!allLessonsByLevel || allLessonsByLevel.length < length) {
        throw new BadRequestException(
          `Insufficient lessons with level "${lessonParent.level}" in database to return ${length} random lessons.`,
        );
      }

      // STEP 2: Shuffle the lessons randomly
      const shuffledLessons = shuffleRandomLessons(allLessonsByLevel);

      // STEP 3: Pick the first N from the shuffled list
      let selectedLessons: Lesson[] = [];
      if (lessonParent.level === LessonLevel.LEVEL_1) {
        const restLessons = shuffledLessons.slice(0, 4);

        // on this point select one lesson from each category (Pawn, Knight, Bishop, Rook, Queen, King)
        const pawnLessons = await this.lessonRepository.find({
          where: {
            level: lessonParent.level,
            lessonParent: { name: LessonParentName.PAWN },
          },
          relations: { lessonParent: true },
        });
        const kingLessons = await this.lessonRepository.find({
          where: {
            level: lessonParent.level,
            lessonParent: { name: LessonParentName.KING },
          },
          relations: { lessonParent: true },
        });
        const knightLessons = await this.lessonRepository.find({
          where: {
            level: lessonParent.level,
            lessonParent: { name: LessonParentName.KNIGHT },
          },
          relations: { lessonParent: true },
        });
        const bishopLessons = await this.lessonRepository.find({
          where: {
            level: lessonParent.level,
            lessonParent: { name: LessonParentName.BISHOP },
          },
          relations: { lessonParent: true },
        });
        const rookLessons = await this.lessonRepository.find({
          where: {
            level: lessonParent.level,
            lessonParent: { name: LessonParentName.ROOK },
          },
          relations: { lessonParent: true },
        });
        const queenLessons = await this.lessonRepository.find({
          where: {
            level: lessonParent.level,
            lessonParent: { name: LessonParentName.QUEEN },
          },
          relations: { lessonParent: true },
        });
        const randomPawnLesson =
          pawnLessons[Math.floor(Math.random() * pawnLessons.length)];
        const randomKingLesson =
          kingLessons[Math.floor(Math.random() * kingLessons.length)];
        const randomKnightLesson =
          knightLessons[Math.floor(Math.random() * knightLessons.length)];
        const randomBishopLesson =
          bishopLessons[Math.floor(Math.random() * bishopLessons.length)];
        const randomRookLesson =
          rookLessons[Math.floor(Math.random() * rookLessons.length)];
        const randomQueenLesson =
          queenLessons[Math.floor(Math.random() * queenLessons.length)];
        selectedLessons = [
          randomKnightLesson,
          randomRookLesson,
          randomBishopLesson,
          randomQueenLesson,
          randomPawnLesson,
          randomKingLesson,
          ...restLessons,
        ];

        selectedLessons = selectedLessons.sort(() => 0.5 - Math.random());
      } else {
        selectedLessons = shuffledLessons.slice(0, length);
      }

      // STEP 4: get amount of lessons test completed
      const testCompletedRow = await this.lessonCompletedTestRepository.findOne(
        {
          where: { userUid, level: lessonParent.level },
        },
      );

      let lessonsDetail: ILessonParentDetail = {
        id: lessonParent.id,
        level: lessonParent.level,
        name: lessonParent.name,
        story: lessonParent.story,
        showHint: lessonParent.showHint,
        isTest: lessonParent.isTest,
        lessonsLength: length,
        lessonsCompleted: 0,
        lastLessonPlayedId: 0,
        lessons: transformSingleLessons(selectedLessons),
      };

      if (testCompletedRow) {
        lessonsDetail.lessonsCompleted = testCompletedRow.testCompleted;
      }

      return lessonsDetail;
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  async findAll(
    findAllLessonParentDto: FindAllLessonParentDto,
  ): Promise<ICountAndListLessonParents> {
    const {
      limit = 10,
      page = 1,
      id = null,
      story = null,
      level = null,
      userUid,
      isTest = null,
    } = findAllLessonParentDto;

    const offset = (page - 1) * limit;

    const findOptions: FindManyOptions<LessonParent> = {
      take: limit,
      skip: offset,
      order: {
        id: 'ASC',
      },
      relations: { lessons: true },
    };

    const whereConditions: any = {};
    if (story) {
      whereConditions.story = story;
    }
    if (id) {
      whereConditions.id = id;
    }
    if (level) {
      whereConditions.level = level;
    }
    if (isTest) {
      const isTestValue = isTest === 'YES';
      whereConditions.isTest = isTestValue;
    }

    if (Object.keys(whereConditions).length > 0) {
      findOptions.where = whereConditions;
    }

    try {
      const [lessonParents, total] =
        await this.lessonParentRepository.findAndCount(findOptions);

      // Force consistent order by ID
      lessonParents.sort((a, b) => a.id - b.id);

      const parents: ILessonParent[] = [];
      let previousLessonParentId = lessonParents[0].id;

      for (const [index, lessonParent] of lessonParents.entries()) {
        let lessonsCompleted: number = 0;
        let lessonsLength: number = 0;

        // STEP: get lessons completed and length if parent is test or normal
        if (lessonParent.isTest) {
          const resultFromTestCompleted =
            await this.lessonCompletedTestRepository.findOne({
              where: { userUid, level: lessonParent.level },
            });

          if (!resultFromTestCompleted) {
            // user has not played test at this moment
            lessonsLength = getTestLessonLengthByLevel(
              lessonParent.level as LessonLevel,
            );
          } else {
            lessonsCompleted = resultFromTestCompleted.testCompleted;
            lessonsLength = resultFromTestCompleted.testLength;
          }
        } else {
          const resultFromNormalCompleted =
            await this.getLessonsLengthAndTotalCompleted(lessonParent, userUid);

          lessonsCompleted = resultFromNormalCompleted.lessonsCompleted;
          lessonsLength = resultFromNormalCompleted.lessonsLength;
        }

        let disabled = false;

        if (index === 0) {
          disabled = false;
        } else {
          const lastLessonParentEnabledRow =
            await this.lessonParentEnabledRepository.findOne({
              where: { userUid, lessonParent: { id: previousLessonParentId } },
            });

          disabled = lastLessonParentEnabledRow ? false : true;

          previousLessonParentId = lessonParent.id;
        }

        parents.push({
          id: lessonParent.id,
          name: lessonParent.name,
          story: lessonParent.story,
          level: lessonParent.level,
          isTest: lessonParent.isTest,
          lessonsCompleted,
          lessonsLength,
          disabled,
        });
      }

      return {
        currentPage: page,
        total,
        parents,
      };
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  // PRIMARY ENDPOINT
  async updateLessonsCompleted(
    completeLessonParentDto: CompleteLessonParentDto,
  ): Promise<CompleteLessonResponse> {
    const {
      userUid,
      lessonParentId,
      completedLessonIds = [],
      earnedPoints = null,
      challengeAchieved = null,
    } = completeLessonParentDto;

    try {
      // verify lesson parent
      const lessonParent = await this.lessonParentRepository.findOne({
        where: { id: lessonParentId },
        relations: { lessons: true },
      });
      if (!lessonParent) {
        throw new BadRequestException(
          `Parent lesson with ID: ${lessonParentId} not found.`,
        );
      }

      if (!lessonParent.isTest && someLessonDuplicates(completedLessonIds)) {
        throw new BadRequestException('Duplicate lesson IDs detected.');
      }

      // STEP: when lesson parent is test
      if (lessonParent.isTest) {
        return await this.completeTestLessons(
          completedLessonIds,
          lessonParent,
          userUid,
        );
      }

      // STEP: validate valid lessonIds belongs to parent
      const { validIds, validatedLessons } =
        await this.validateLessonExistAndAlsoBelongsToParent(
          lessonParent,
          completedLessonIds,
        );
      if (!validIds) {
        throw new BadRequestException(`One or more invalid Lesson ID`);
      }

      // separate logic from Level 1 to rest of levels
      if (lessonParent.level === LessonLevel.LEVEL_1) {
        return await this.completeLevelOneLessons(
          userUid,
          lessonParent,
          completedLessonIds,
          validatedLessons,
        );
      }

      // Level 2, 3, 4, 5 ...
      return await this.completeLessonsFromAllLevelsExceptLevel1(
        userUid,
        lessonParent,
        completedLessonIds,
        validatedLessons,
        earnedPoints,
        challengeAchieved,
      );
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  // SECONDARY ENDPOINT Level 2, 3, 4, 5 ...
  private async completeLessonsFromAllLevelsExceptLevel1(
    userUid: number,
    lessonParent: LessonParent,
    completedLessonIds: number[],
    validatedLessons: Lesson[],
    earnedPointsFromFrontend: number | null,
    challengeAchieved: boolean | null,
  ): Promise<CompleteLessonResponse> {
    try {
      if (
        !earnedPointsFromFrontend ||
        challengeAchieved === null ||
        challengeAchieved === undefined
      ) {
        throw new BadRequestException(
          `Properties earnedPoints and challengeAchieved are required in Body data for this level: ${lessonParent.level}.`,
        );
      }

      // STEP 0: verify if user will increment points or not
      const { lessonsLength, lessonsCompleted } =
        await this.getLessonsLengthAndTotalCompleted(lessonParent, userUid);
      const stillLessonsToComplete = lessonsCompleted < lessonsLength;

      // STEP 1: update lesson completed rows
      const newCompletedLessonArray: Promise<LessonCompleted>[] = [];
      for (const lesson of validatedLessons) {
        const completedLessonExists =
          await this.lessonCompletedRepository.findOne({
            where: { lesson: { id: lesson.id }, userUid },
          });

        // only create a new row of lesson_completed if it was not completed yet
        if (!completedLessonExists) {
          const newLessonCompleted = this.lessonCompletedRepository.create({
            lesson,
            userUid,
          });

          newCompletedLessonArray.push(
            this.lessonCompletedRepository.save(newLessonCompleted),
          );
        }
      }

      await Promise.all(newCompletedLessonArray);

      // STEP 2: verify if data come with challenge achieved
      // if challenge achieved we can not verify if lesson parent is completed for the same way we divide lessonsCompleted/lessonsLength because challenge was achieved
      if (challengeAchieved) {
        const lessonParentEnabledRow =
          await this.lessonParentEnabledRepository.findOne({
            where: { userUid, lessonParent: { id: lessonParent.id } },
          });

        if (!lessonParentEnabledRow) {
          // create new lesson parent enabled row
          const newLessonParentEnabled =
            this.lessonParentEnabledRepository.create({
              userUid,
              lessonParent,
            });

          await this.lessonParentEnabledRepository.save(newLessonParentEnabled);
        }
      }

      // STEP 3: in both cases we need to store last lesson played to track the progress
      const lastLessonPlayedRow = await this.lessonPlayedRepository.findOne({
        where: { userUid, lessonParent: { id: lessonParent.id } },
      });
      if (lastLessonPlayedRow) {
        // update last lesson played id
        await this.lessonPlayedRepository.update(
          { id: lastLessonPlayedRow.id },
          { lastLessonPlayed: Math.max(...completedLessonIds) },
        );
      } else {
        // create new last lesson played row
        const newLastLessonPlayed = this.lessonPlayedRepository.create({
          userUid,
          lessonParent: lessonParent,
          lastLessonPlayed: Math.max(...completedLessonIds),
        });

        await this.lessonPlayedRepository.save(newLastLessonPlayed);
      }

      // STEP 4: Add lesson points to user counter
      const dataPoints: UpdateUserPointsDto = {
        uid: userUid,
        points: stillLessonsToComplete ? earnedPointsFromFrontend : 0,
        typeUserCounter: typeUserCounterByStoryLesson(
          lessonParent.story as LessonStoryName,
        ),
      };
      const { lastPoints, earnedPoints, counter } = await firstValueFrom(
        this.client.send('update.points.user', dataPoints),
      );

      let isCurrentLessonParentCompleted: boolean = challengeAchieved;

      // STEP 5: in case challenge was not achieved update lessonParentEnabled row by calculating
      if (!challengeAchieved) {
        isCurrentLessonParentCompleted = await this.handleLessonParentEnabled(
          userUid,
          lessonParent,
        );
      }

      const response: CompleteLessonResponse = {
        lastPoints,
        earnedPoints,
        counter,
        nextLessonParentId: await this.getNextLessonParentId(lessonParent),
        nextLessonParentDisabled: !isCurrentLessonParentCompleted,
      };

      return response;
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  // SECONDARY ENDPOINT
  private async completeLevelOneLessons(
    userUid: number,
    lessonParent: LessonParent,
    completedLessonIds: number[],
    validatedLessons: Lesson[],
  ): Promise<CompleteLessonResponse> {
    try {
      let earnedPointsByUser = 0;

      // STEP: update lessons completed and earned points
      const newCompletedLessonArray: Promise<LessonCompleted>[] = [];
      // iterate over array of lessons ids
      for (const lesson of validatedLessons) {
        const completedLessonExists =
          await this.lessonCompletedRepository.findOne({
            where: { lesson: { id: lesson.id }, userUid },
          });

        // only create a new row of lesson_completed if it was not completed yet
        if (!completedLessonExists) {
          const newLessonCompleted = this.lessonCompletedRepository.create({
            lesson,
            userUid,
          });

          newCompletedLessonArray.push(
            this.lessonCompletedRepository.save(newLessonCompleted),
          );

          earnedPointsByUser += lesson.points;
        }
      }

      await Promise.all(newCompletedLessonArray);

      // Add lesson points to user counter
      const dataPoints: UpdateUserPointsDto = {
        uid: userUid,
        points: earnedPointsByUser,
        typeUserCounter: typeUserCounterByStoryLesson(
          lessonParent.story as LessonStoryName,
        ),
      };
      const { lastPoints, earnedPoints, counter } = await firstValueFrom(
        this.client.send('update.points.user', dataPoints),
      );

      // STEP: update last lesson id played
      const lastLessonPlayedRow = await this.lessonPlayedRepository.findOne({
        where: { userUid, lessonParent: { id: lessonParent.id } },
      });
      if (lastLessonPlayedRow) {
        // update last lesson played id
        await this.lessonPlayedRepository.update(
          { id: lastLessonPlayedRow.id },
          { lastLessonPlayed: Math.max(...completedLessonIds) },
        );
      } else {
        // create new last lesson played row
        const newLastLessonPlayed = this.lessonPlayedRepository.create({
          userUid,
          lessonParent: lessonParent,
          lastLessonPlayed: Math.max(...completedLessonIds),
        });

        await this.lessonPlayedRepository.save(newLastLessonPlayed);
      }

      // STEP: update lessonParentEnabled row
      const isCurrentLessonParentCompleted =
        await this.handleLessonParentEnabled(userUid, lessonParent);

      const response: CompleteLessonResponse = {
        lastPoints,
        earnedPoints,
        counter,
        nextLessonParentId: await this.getNextLessonParentId(lessonParent),
        nextLessonParentDisabled: !isCurrentLessonParentCompleted,
      };

      return response;
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  // SECONDARY ENDPOINT
  private async completeTestLessons(
    completedLessonIds: number[],
    lessonParent: LessonParent,
    userUid: number,
  ): Promise<CompleteLessonResponse> {
    try {
      // STEP 1: get test length by level
      const lessonsLength = getTestLessonLengthByLevel(
        lessonParent.level as LessonLevel,
      );

      // STEP 2: validate lessonIds
      for (const lessonId of completedLessonIds) {
        const lesson = await this.lessonRepository.findOne({
          where: { id: lessonId },
        });

        if (!lesson) {
          throw new BadRequestException('One or more Lesson Ids not found.');
        }
      }

      // STEP 3: create new testRow if first time or update
      const testCompletedRow = await this.lessonCompletedTestRepository.findOne(
        {
          where: { userUid, level: lessonParent.level },
        },
      );

      if (!testCompletedRow) {
        // create new test row
        const newTestRow = this.lessonCompletedTestRepository.create({
          level: lessonParent.level,
          userUid,
          testLength: lessonsLength,
          testCompleted: completedLessonIds.length,
        });

        await this.lessonCompletedTestRepository.save(newTestRow);
      } else {
        if (completedLessonIds.length > testCompletedRow.testCompleted) {
          // update test row
          await this.lessonCompletedTestRepository.update(
            { id: testCompletedRow.id },
            { testCompleted: completedLessonIds.length },
          );
        }
      }

      // STEP 3.1: save new Lesson Parent Test Record
      const newLessonParentTestRecord =
        this.lessonParentTestRecordRepository.create({
          lessonParent,
          userUid,
          lessons: completedLessonIds.map((completedLessonId) =>
            completedLessonId.toString(),
          ),
        });
      await this.lessonParentTestRecordRepository.save(
        newLessonParentTestRecord,
      );

      // STEP 4: Add lesson points to user counter
      const dataPoints: UpdateUserPointsDto = {
        uid: userUid,
        points: 0,
        typeUserCounter: typeUserCounterByStoryLesson(
          lessonParent.story as LessonStoryName,
        ),
      };
      const { lastPoints, earnedPoints, counter } = await firstValueFrom(
        this.client.send('update.points.user', dataPoints),
      );

      // STEP 5: get next lesson parent
      const isCurrentLessonParentCompleted =
        await this.handleLessonParentEnabled(userUid, lessonParent);

      const response: CompleteLessonResponse = {
        lastPoints,
        earnedPoints,
        counter,
        nextLessonParentId: await this.getNextLessonParentId(lessonParent),
        nextLessonParentDisabled: !isCurrentLessonParentCompleted,
      };

      return response;
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  // SECONDARY ENDPOINT
  private async handleLessonParentEnabled(
    userUid: number,
    lessonParent: LessonParent,
  ): Promise<boolean> {
    try {
      const lessonParentEnabledRow =
        await this.lessonParentEnabledRepository.findOne({
          where: { userUid, lessonParent: { id: lessonParent.id } },
        });
      if (lessonParentEnabledRow) {
        return true;
      }

      // calculate if this lesson parent is enabled
      const lessonParentHasBeenCompleted =
        await this.isCurrentLessonParentCompleted(lessonParent, userUid);
      if (lessonParentHasBeenCompleted) {
        // create new lesson parent enabled row
        const newLessonParentEnabled =
          this.lessonParentEnabledRepository.create({
            userUid,
            lessonParent,
          });

        await this.lessonParentEnabledRepository.save(newLessonParentEnabled);

        return true;
      }

      return false;
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  private async isCurrentLessonParentCompleted(
    lessonParent: LessonParent,
    userUid: number,
  ): Promise<boolean> {
    try {
      // STEP 1 get completed and length
      let lessonsLength = 0;
      let lessonsCompleted = 0;
      if (lessonParent.isTest) {
        lessonsLength = getTestLessonLengthByLevel(
          lessonParent.level as LessonLevel,
        );

        const testLessonRow = await this.lessonCompletedTestRepository.findOne({
          where: { userUid, level: lessonParent.level },
        });

        if (testLessonRow) {
          lessonsCompleted = testLessonRow.testCompleted;
        }
      } else {
        const resultFromNormalLessons =
          await this.getLessonsLengthAndTotalCompleted(lessonParent, userUid);

        lessonsLength = resultFromNormalLessons.lessonsLength;
        lessonsCompleted = resultFromNormalLessons.lessonsCompleted;
      }

      let factor = getFactorLesson(lessonParent);
      // STEP 2 verify is open to play
      const isCurrentLessonParentCompleted =
        lessonsLength > 0 && lessonsCompleted / lessonsLength >= factor;

      return isCurrentLessonParentCompleted;
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  private async getNextLessonParentId(
    lessonParent: LessonParent,
  ): Promise<number | null> {
    try {
      const nextLessonParent = await this.lessonParentRepository.findOne({
        where: { id: MoreThan(lessonParent.id) },
        order: { id: 'ASC' },
        select: ['id'], // We just need the ID
      });

      return nextLessonParent?.id || null; // null if doesn't exist,
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  private async validateLessonExistAndAlsoBelongsToParent(
    lessonParent: LessonParent,
    lessonIds: number[],
  ): Promise<{ validIds: boolean; validatedLessons: Lesson[] }> {
    let validIds = true;
    const validatedLessons: Lesson[] = [];

    try {
      for (const lessonId of lessonIds) {
        const lesson = await this.lessonRepository.findOne({
          where: { id: lessonId },
          relations: { lessonParent: true },
        });
        if (!lesson) {
          validIds = false;
          throw new BadRequestException('One or more Lesson Ids not found.');
        }

        if (lesson.lessonParent.id !== lessonParent.id) {
          validIds = false;
          throw new BadRequestException(
            `One or more Lesson Id does not belongs to Parent Lesson: ${lessonParent.name}.`,
          );
        }

        validatedLessons.push(lesson);
      }

      return { validIds, validatedLessons };
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  private async getLessonsLengthAndTotalCompleted(
    lessonParent: LessonParent,
    userUid: number,
  ): Promise<{ lessonsLength: number; lessonsCompleted: number }> {
    try {
      const lessons = lessonParent.lessons;
      const lessonsLength = lessons.length;

      // Get completed lesson IDs for the user
      const [completedLessonRowsByThisUser, count] =
        await this.lessonCompletedRepository.findAndCount({
          where: { userUid, lesson: { lessonParent: { id: lessonParent.id } } },
          relations: { lesson: { lessonParent: true } },
        });

      return {
        lessonsLength,
        lessonsCompleted: count,
      };
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }
}
