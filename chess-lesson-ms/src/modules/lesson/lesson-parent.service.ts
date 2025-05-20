import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, MoreThan, Repository } from 'typeorm';
import { firstValueFrom } from 'rxjs';

import { NATS_SERVICE } from 'src/config';
import { Lesson } from './entities/lesson.entity';
import { LessonParent } from './entities/lesson-parent.entity';
import { LessonCompleted } from './entities/lesson-completed.entity';
import { LessonCompletedTest } from './entities/lesson-completed-test.entity';

import { transformSingleLessons } from './helpers/transform-lesson.helper';
import { someLessonDuplicates } from './helpers/duplicate-lesson.helper';
import { getTestLessonLengthByLevel } from './helpers/get-test-lesson-length-by-level.helper';

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
import { LessonLevel } from 'src/enum';

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
  ) {}

  async create(
    createLessonParentDto: CreateLessonParentDto,
  ): Promise<LessonParent> {
    const { level, name, showHint } = createLessonParentDto;
    try {
      const newLessonParent = this.lessonParentRepository.create({
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

      const lessonsArray = lessonParent.isTest
        ? lessonParent.lessons.sort(() => 0.5 - Math.random())
        : lessonParent.lessons;

      const result: ILessonParentDetail = {
        id: lessonParent.id,
        level: lessonParent.level,
        name: lessonParent.name,
        showHint: lessonParent.showHint,
        isTest: lessonParent.isTest,
        lessonsLength,
        lessonsCompleted,
        lessons: transformSingleLessons(lessonsArray),
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
      const shuffledLessons = allLessonsByLevel.sort(() => 0.5 - Math.random());

      // STEP 3: Pick the first N from the shuffled list
      const selectedLessons = shuffledLessons.slice(0, length);

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
        showHint: lessonParent.showHint,
        isTest: lessonParent.isTest,
        lessonsLength: length,
        lessonsCompleted: 0,
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
      level = null,
      userUid,
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
    if (id) {
      whereConditions.id = id;
    }
    if (level) {
      whereConditions.level = level;
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
      let previousIsCompletedEnough = true;
      let previousLessonParent = lessonParents[0];

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
          disabled = !previousIsCompletedEnough;
        }

        // determine which factor (it helps with disabled or not)
        const factor = previousLessonParent.isTest ? 0.7 : 0.5;
        previousLessonParent = lessonParent;

        // Prepare for next iteration
        previousIsCompletedEnough =
          lessonsLength > 0 && lessonsCompleted / lessonsLength >= factor;

        parents.push({
          id: lessonParent.id,
          name: lessonParent.name,
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

  async updateLessonsCompleted(
    completeLessonParentDto: CompleteLessonParentDto,
  ): Promise<CompleteLessonResponse> {
    const {
      userUid,
      lessonParentId,
      completedLessonIds = [],
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

      if (someLessonDuplicates(completedLessonIds)) {
        throw new BadRequestException('Duplicate lesson IDs detected.');
      }

      // validate if it is not test
      if (lessonParent.isTest) {
        return await this.completeTestLessons(
          completedLessonIds,
          lessonParent,
          userUid,
        );
      }

      const { validIds, validatedLessons } =
        await this.validateLessonExistAndAlsoBelongsToParent(
          lessonParent,
          completedLessonIds,
        );
      if (!validIds) {
        throw new BadRequestException(`One or more invalid Lesson ID`);
      }

      let earnedPointsByUser = 0;

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
      };
      const { lastPoints, earnedPoints, counter } = await firstValueFrom(
        this.client.send('update.points.user', dataPoints),
      );

      const { nextLessonParentId, nextLessonParentDisabled } =
        await this.getNextLessonParentProps(lessonParent, userUid);

      const response: CompleteLessonResponse = {
        lastPoints,
        earnedPoints,
        counter,
        nextLessonParentId,
        nextLessonParentDisabled,
      };

      return response;
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

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

      // STEP 2: validate valid lessonIds
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

      // STEP 4: Add lesson points to user counter
      const dataPoints: UpdateUserPointsDto = {
        uid: userUid,
        points: 0,
      };
      const { lastPoints, earnedPoints, counter } = await firstValueFrom(
        this.client.send('update.points.user', dataPoints),
      );

      // STEP 5: get next lesson parent
      const { nextLessonParentId, nextLessonParentDisabled } =
        await this.getNextLessonParentProps(lessonParent, userUid);

      const response: CompleteLessonResponse = {
        lastPoints,
        earnedPoints,
        counter,
        nextLessonParentId,
        nextLessonParentDisabled,
      };

      return response;
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  private async getNextLessonParentProps(
    lessonParent: LessonParent,
    userUid: number,
  ) {
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

      let factor = lessonParent.isTest ? 0.7 : 0.5;
      // STEP 2 verify is open to play
      const lessonParentIsOpenToPlay =
        lessonsLength > 0 && lessonsCompleted / lessonsLength >= factor;

      // STEP 3 get next lessonParentId
      const nextLessonParent = await this.lessonParentRepository.findOne({
        where: { id: MoreThan(lessonParent.id) },
        order: { id: 'ASC' },
        select: ['id'], // We just need the ID
      });

      return {
        nextLessonParentId: nextLessonParent?.id || null, // null if doesn't exist,
        nextLessonParentDisabled: !lessonParentIsOpenToPlay,
      };
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
