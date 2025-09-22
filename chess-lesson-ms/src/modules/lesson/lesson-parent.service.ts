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

import { LessonService } from './lesson.service';
import { transformSingleLessons } from './helpers/transform-lesson.helper';
import { someLessonDuplicates } from './helpers/duplicate-lesson.helper';
import { shuffleRandomLessons } from './helpers/shuffle-random-lessons.helper';
import { typeUserCounterByStoryLesson } from 'src/utils/type-user-counter-by-story-lesson';
import { lessonParentDataSeed } from './seed/lesson-parent-data-seed';
import { getLessonsCompletedAsGame } from './helpers/get-lessons-completed-as-game.helper';
import { getLessonsCompletedAsBot } from './helpers/get-lessons-completed-as-bot.helper';
import { verifyToUnlockNextStory } from './helpers/verify-to-unlock-story.helper';

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
    private readonly lessonService: LessonService,
  ) {}

  async seedLessonsParents(): Promise<string> {
    try {
      const insertedLessonParentsArray: string[] = [];
      const data = lessonParentDataSeed as any; // needed to set any to avoid DeepPartial error

      for (const lessonParentObject of data) {
        const existLessonParent = await this.lessonParentRepository.findOne({
          where: {
            name: lessonParentObject.name,
            story: lessonParentObject.story,
          },
        });
        if (existLessonParent) {
          continue;
        }

        const newLessonParent = this.lessonParentRepository.create({
          ...lessonParentObject,
        });

        await this.lessonParentRepository.save(newLessonParent);

        insertedLessonParentsArray.push(lessonParentObject.name);
      }

      return `These Lesson Parents SEED data was inserted: [${insertedLessonParentsArray.join(', ')}]`;
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  // async create(
  //   createLessonParentDto: CreateLessonParentDto,
  // ): Promise<LessonParent> {
  //   try {
  //     const newLessonParent: LessonParent = this.lessonParentRepository.create({
  //       ...createLessonParentDto,
  //     });

  //     return await this.lessonParentRepository.save(newLessonParent);
  //   } catch (error) {
  //     throw new RpcException({
  //       status: 400,
  //       message: error.message,
  //     });
  //   }
  // }

  /*
    some lessonParent isGame or isBot was completed and mark it as enabled
  */
  async markAsEnabledSomeLessonParentFromGameOrBot(
    lessonParentName: string,
    userUid: number,
  ): Promise<void> {
    try {
      const lessonParent = await this.lessonParentRepository.findOne({
        where: { name: lessonParentName },
      });
      if (!lessonParent) {
        throw new BadRequestException(
          `Lesson parent with Name: ${lessonParentName} not found`,
        );
      }

      const existLessonParentEnableRow =
        await this.lessonParentEnabledRepository.findOne({
          where: { lessonParent: { id: lessonParent.id }, userUid },
        });

      if (existLessonParentEnableRow) return; // already completed by isGame or isBot

      const newLessonParentEnabledRow =
        this.lessonParentEnabledRepository.create({
          lessonParent,
          userUid,
        });

      await this.lessonParentEnabledRepository.save(newLessonParentEnabledRow);
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
        lessonFactor: lessonParent.lessonFactor,
        canBeSkipped: lessonParent.canBeSkipped,
        name: lessonParent.name,
        timer: lessonParent.timer,
        levelFrontend: lessonParent.levelFrontend,
        pointsPerLesson: lessonParent.pointsPerLesson,
        quantityToUnlockNext: lessonParent.quantityToUnlockNext,
        level: lessonParent.level,
        story: lessonParent.story,
        showHint: lessonParent.showHint,
        isTest: lessonParent.isTest,
        isBot: lessonParent.isBot,
        isGame: lessonParent.isGame,
        isPreview: lessonParent.isPreview,
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
      // STEP 1: Get all lessons with this level but only from pgn 250 (isPreview:false)
      const allLessonsByLevel = await this.lessonRepository.find({
        where: {
          level: lessonParent.level,
          story: lessonParent.story,
          lessonParent: { isPreview: false },
        },
      });

      if (!allLessonsByLevel || allLessonsByLevel.length < 10) {
        throw new BadRequestException(
          `Insufficient lessons with level "${lessonParent.level}" in database to return ${10} random lessons.`,
        );
      }

      // STEP 2: Shuffle the lessons randomly
      const shuffledLessons = shuffleRandomLessons(allLessonsByLevel);

      // STEP 3: Pick the first N from the shuffled list
      let selectedLessons: Lesson[] = [];
      if (
        lessonParent.level === LessonLevel.LEVEL_1 &&
        lessonParent.story === LessonStoryName.EDUCATION
      ) {
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
        selectedLessons = shuffledLessons.slice(0, 10);
      }

      // STEP 4: get amount of lessons test completed
      const testCompletedRow = await this.lessonCompletedTestRepository.findOne(
        {
          where: { userUid, lessonParent: { id: lessonParent.id } },
        },
      );

      let lessonsDetail: ILessonParentDetail = {
        id: lessonParent.id,
        lessonFactor: lessonParent.lessonFactor,
        canBeSkipped: lessonParent.canBeSkipped,
        timer: lessonParent.timer,
        level: lessonParent.level,
        levelFrontend: lessonParent.levelFrontend,
        pointsPerLesson: lessonParent.pointsPerLesson,
        quantityToUnlockNext: lessonParent.quantityToUnlockNext,
        name: lessonParent.name,
        story: lessonParent.story,
        showHint: lessonParent.showHint,
        isTest: lessonParent.isTest,
        isBot: lessonParent.isBot,
        isGame: lessonParent.isGame,
        isPreview: lessonParent.isPreview,
        lessonsLength: 10, // is a test
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
      userUid: userAuthenticatedUid,
      studentUid = null,
      isTest = null,
      onlyLessons = null,
    } = findAllLessonParentDto;

    const offset = (page - 1) * limit;
    const userUid = studentUid ?? userAuthenticatedUid;

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
    if (isTest) {
      const isTestValue = isTest === 'YES';
      whereConditions.isTest = isTestValue;
    }
    if (onlyLessons && onlyLessons === 'YES') {
      whereConditions.isGame = false;
      whereConditions.isBot = false;
    }

    if (Object.keys(whereConditions).length > 0) {
      findOptions.where = whereConditions;
    }

    try {
      // STEP 1: find all lesson parents
      const [lessonParents, total] =
        await this.lessonParentRepository.findAndCount(findOptions);

      // Force consistent order by ID
      lessonParents.sort((a, b) => a.id - b.id);

      const parents: ILessonParent[] = [];
      const disabledArray: boolean[] = [];

      // STEP 2: calculate progress
      for (const [index, lessonParent] of lessonParents.entries()) {
        let lessonsCompleted: number = 0;
        let lessonsLength: number = 0;

        // STEP: get lessons completed and length if parent is test or normal
        if (lessonParent.isTest) {
          const resultFromTestCompleted =
            await this.lessonCompletedTestRepository.findOne({
              where: { userUid, lessonParent: { id: lessonParent.id } },
            });

          if (!resultFromTestCompleted) {
            // user has not played test at this moment
            lessonsLength = 10;
          } else {
            lessonsCompleted = resultFromTestCompleted.testCompleted;
            lessonsLength = resultFromTestCompleted.testLength;
          }
        } else if (lessonParent.isGame) {
          lessonsCompleted = await getLessonsCompletedAsGame(
            this.client,
            lessonParent,
            userUid,
          );
        } else if (lessonParent.isBot) {
          lessonsCompleted = await getLessonsCompletedAsBot(
            this.client,
            userUid,
          );
        } else {
          const resultFromNormalCompleted =
            await this.getLessonsLengthAndTotalCompleted(lessonParent, userUid);

          lessonsCompleted = resultFromNormalCompleted.lessonsCompleted;
          lessonsLength = resultFromNormalCompleted.lessonsLength;
        }

        // STEP 3: determine if enabled
        let disabled = false;
        if (index === 0) {
          disabled = false;
        } else {
          const prevEnabled = await this.lessonParentEnabledRepository.findOne({
            where: {
              userUid,
              lessonParent: { id: lessonParents[index - 1].id },
            },
          });

          if (
            lessonParents[index - 1].isBot ||
            lessonParents[index - 1].isGame
          ) {
            // Can be unlocked if bot/game is done and penultimate isn't locked
            const penultimateDisabled = disabledArray[index - 1] ?? false;
            disabled = !prevEnabled || penultimateDisabled;
          } else {
            disabled = !prevEnabled;
          }
        }

        disabledArray.push(disabled);

        parents.push({
          id: lessonParent.id,
          lessonFactor: lessonParent.lessonFactor,
          canBeSkipped: lessonParent.canBeSkipped,
          timer: lessonParent.timer,
          levelFrontend: lessonParent.levelFrontend,
          pointsPerLesson: lessonParent.pointsPerLesson,
          quantityToUnlockNext: lessonParent.quantityToUnlockNext,
          name: lessonParent.name,
          story: lessonParent.story,
          level: lessonParent.level,
          isTest: lessonParent.isTest,
          isBot: lessonParent.isBot,
          isGame: lessonParent.isGame,
          isPreview: lessonParent.isPreview,
          messageModal: lessonParent.messageModal ?? null,
          lessonsCompleted,
          lessonsLength:
            lessonParent.isGame || lessonParent.isBot
              ? lessonParent.quantityToUnlockNext
              : lessonsLength,
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
      failedLessonId = null,
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

      // when lesson parent is test
      if (lessonParent.isTest) {
        return await this.completeTestLessons(
          completedLessonIds,
          lessonParent,
          userUid,
          failedLessonId,
        );
      }

      // validate lessonIds belongs to parent
      const { validIds, validatedLessons } =
        await this.validateLessonExistAndAlsoBelongsToParent(
          lessonParent,
          completedLessonIds,
        );
      if (!validIds) {
        throw new BadRequestException(`One or more invalid Lesson ID`);
      }

      return await this.completeLevelsFromNormalLessons(
        userUid,
        lessonParent,
        completedLessonIds,
        validatedLessons,
        failedLessonId,
      );
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  // SECONDARY ENDPOINT
  private async completeLevelsFromNormalLessons(
    userUid: number,
    lessonParent: LessonParent,
    completedLessonIds: number[],
    validatedLessons: Lesson[],
    failedLessonId: number | null = null,
  ): Promise<CompleteLessonResponse> {
    try {
      let earnedPointsByUser = 0;

      // STEP 1: update lessons completed and earned points
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

          earnedPointsByUser += lesson.points;
        }
      }

      await Promise.all(newCompletedLessonArray);

      // STEP 2: Add lesson points to user counter
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

      // STEP 3: update last lesson id played
      const lastLessonPlayedRow = await this.lessonPlayedRepository.findOne({
        where: { userUid, lessonParent: { id: lessonParent.id } },
      });
      if (lastLessonPlayedRow && completedLessonIds.length) {
        await this.lessonPlayedRepository.update(
          { id: lastLessonPlayedRow.id },
          { lastLessonPlayed: Math.max(...completedLessonIds) },
        );
      } else if (completedLessonIds.length) {
        // create new last lesson played row
        const newLastLessonPlayed = this.lessonPlayedRepository.create({
          userUid,
          lessonParent: lessonParent,
          lastLessonPlayed: Math.max(...completedLessonIds),
        });

        await this.lessonPlayedRepository.save(newLastLessonPlayed);
      }

      // STEP 4: update lessonParentEnabled row
      const isCurrentLessonParentCompleted =
        await this.handleLessonParentEnabled(userUid, lessonParent);

      const response: CompleteLessonResponse = {
        lastPoints,
        earnedPoints,
        counter,
        nextLessonParentId: await this.getNextLessonParentId(lessonParent),
        nextLessonParentDisabled: !isCurrentLessonParentCompleted,
      };

      // STEP 5: update lesson single records
      await this.lessonService.updateLessonSingleRecord(
        userUid,
        lessonParent,
        validatedLessons,
        failedLessonId,
      );

      // STEP 6: update lastCorrectPuzzleAt property in AuthPanda
      await firstValueFrom(
        this.client.emit('update.lastCorrectPuzzleAt.panda', userUid),
      );

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
    failedLessonId: number | null,
  ): Promise<CompleteLessonResponse> {
    try {
      // STEP 1: get test length by level
      const lessonsLength = 10;

      // STEP 2: validate lessonIds
      for (const lessonId of completedLessonIds) {
        const lesson = await this.lessonRepository.findOne({
          where: { id: lessonId },
        });

        if (!lesson) {
          throw new BadRequestException('One or more Lesson Ids not found.');
        }
      }

      // STEP 2.1: if failedLessonId validate that id exists
      if (failedLessonId) {
        const existsFailedLesson = await this.lessonRepository.findOne({
          where: { id: failedLessonId },
        });

        if (!existsFailedLesson) {
          throw new BadRequestException(
            `Failed Lesson Id: ${failedLessonId} not found.`,
          );
        }
      }

      // STEP 3: create new testRow if first time or update
      const testCompletedRow = await this.lessonCompletedTestRepository.findOne(
        {
          where: { userUid, lessonParent: { id: lessonParent.id } },
        },
      );

      if (!testCompletedRow) {
        // create new test row
        const newTestRow = this.lessonCompletedTestRepository.create({
          lessonParent: lessonParent,
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
          failedLessonId: failedLessonId ?? undefined,
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

      // STEP 6: verify to unlock next story
      await verifyToUnlockNextStory(this.client, userUid, lessonParent);

      // STEP 7: update lastCorrectPuzzleAt property in AuthPanda
      if (completedLessonIds.length > 6) {
        await firstValueFrom(
          this.client.emit('update.lastCorrectPuzzleAt.panda', userUid),
        );
      }

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
        lessonsLength = 10;

        const testLessonRow = await this.lessonCompletedTestRepository.findOne({
          where: { userUid, lessonParent: { id: lessonParent.id } },
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

      // STEP 2 verify is open to play
      const isCurrentLessonParentCompleted =
        lessonsLength > 0 &&
        lessonsCompleted / lessonsLength >= lessonParent.lessonFactor;

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
        where: { id: MoreThan(lessonParent.id), story: lessonParent.story },
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
