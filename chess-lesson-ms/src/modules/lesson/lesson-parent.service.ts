import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { firstValueFrom } from 'rxjs';

import { NATS_SERVICE } from 'src/config';
import { Lesson } from './entities/lesson.entity';
import { LessonParent } from './entities/lesson-parent.entity';
import { LessonCompleted } from './entities/lesson-completed.entity';

import { transformSingleLessons } from './helpers/transform-lesson.helper';
import { someLessonDuplicates } from './helpers/duplicate-lesson.helper';

import { CreateLessonParentDto } from './dto/create-lesson-parent.dto';
import { FindAllLessonParentDto } from './dto/find-all-lesson-parent.dto';
import { CompleteLessonParentDto } from './dto/complete-lesson-parent.dto';
import { FindOneLessonParentDto } from './dto/find-one-lesson-parent.dto';
import { UpdateUserPointsDto } from './dto/update-user-points.dto';
import { ICountAndListLessonParents, ILessonParentDetail } from './interfaces';

@Injectable()
export class LessonParentService {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
    @InjectRepository(LessonCompleted)
    private readonly lessonCompletedRepository: Repository<LessonCompleted>,
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

      const { lessonsLength, lessonsCompleted } =
        await this.getLessonsLengthAndTotalCompleted(lessonParent, userUid);

      const result: ILessonParentDetail = {
        id: lessonParent.id,
        level: lessonParent.level,
        name: lessonParent.name,
        showHint: lessonParent.showHint,
        lessonsLength,
        lessonsCompleted,
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

      // store if previous lesson_parent is 50% completed at least or not
      let previousIsCompletedEnough = true;

      const parents = await Promise.all(
        lessonParents.map(async (lessonParent, index) => {
          const { lessonsCompleted, lessonsLength } =
            await this.getLessonsLengthAndTotalCompleted(lessonParent, userUid);

          // determine if current lesson_parent should be disabled based on previous
          let disabled = false;

          if (index === 0) {
            disabled = false; // First lessonParent is always enabled
          } else {
            disabled = !previousIsCompletedEnough;
          }

          // calculate 50% completion for this one for the *next* check
          previousIsCompletedEnough =
            lessonsLength > 0 && lessonsCompleted / lessonsLength >= 0.5;

          return {
            id: lessonParent.id,
            name: lessonParent.name,
            level: lessonParent.level,
            lessonsCompleted,
            lessonsLength,
            disabled,
          };
        }),
      );

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
  ) {
    const {
      userUid,
      lessonParentId,
      completedLessonIds = [],
    } = completeLessonParentDto;
    try {
      // verify lesson parent
      const lessonParent = await this.lessonParentRepository.findOneBy({
        id: lessonParentId,
      });
      if (!lessonParent) {
        throw new BadRequestException(
          `Parent lesson with ID: ${lessonParentId} not found.`,
        );
      }

      if (someLessonDuplicates(completedLessonIds)) {
        throw new BadRequestException('Duplicate lesson IDs detected.');
      }

      // validate
      const { validIds, validatedLessons } =
        await this.validateLessonExistAndAlsoBelongsToParent(
          lessonParent,
          completedLessonIds,
        );
      if (!validIds) {
        throw new BadRequestException(`One or more invalid Lesson ID`);
      }

      const earnedPointsByUser = validatedLessons.reduce((total, lesson) => {
        return total + (lesson.points || 0);
      }, 0);

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

      return { lastPoints, earnedPoints, counter };
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
