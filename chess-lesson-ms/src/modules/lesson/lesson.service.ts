import { Injectable, NotFoundException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { FindManyOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Lesson } from './entities/lesson.entity';
import { LessonParent } from './entities/lesson-parent.entity';
import {
  ICountAndListLessons,
  ILessonsList,
} from './interfaces/lesson.interface';
import { FindOneLessonDto } from './dto/find-one-lesson.dto';
import { FindAllLessonsDto } from './dto/find-all-lessons.dto';
import { CreateLessonParentDto } from './dto/create-lesson-parent.dto';

@Injectable()
export class LessonService {
  constructor(
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
    @InjectRepository(LessonParent)
    private readonly lessonParentRepository: Repository<LessonParent>,
  ) {}

  async findAll(
    findAllLessonsDto: FindAllLessonsDto,
  ): Promise<ICountAndListLessons> {
    const {
      limit = 10,
      page = 1,
      id = null,
      level = null,
      userUid,
    } = findAllLessonsDto;

    const offset = (page - 1) * limit;

    const findOptions: FindManyOptions<Lesson> = {
      take: limit,
      skip: offset,
      order: {
        id: 'ASC',
      },
      relations: { lessonsCompleted: true },
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
      const [lessons, total] =
        await this.lessonRepository.findAndCount(findOptions);

      return {
        currentPage: page,
        total,
        lessons: this.transformLessonsList(lessons, userUid),
      };
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  async findOne(findOneLessonDto: FindOneLessonDto): Promise<ILessonsList> {
    const { lessonId, userUid } = findOneLessonDto;

    try {
      const lessonById = await this.lessonRepository.findOne({
        where: { id: lessonId },
        relations: { lessonsCompleted: true },
      });
      if (!lessonById) {
        throw new NotFoundException(`Lesson by ID: ${lessonById} not found.`);
      }

      const { lessonsCompleted, ...restLesson } = lessonById;

      const lessonWithCompletedProperty: ILessonsList = {
        ...restLesson,
        isCompleted: lessonById.lessonsCompleted.some(
          (lesson) => lesson.userUid === userUid,
        ),
        moves: lessonById.moves.split(' '),
      };

      return lessonWithCompletedProperty;
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  private transformLessonsList(
    lessons: Lesson[],
    userUid: number,
  ): ILessonsList[] {
    return lessons.map((lesson) => ({
      id: lesson.id,
      level: lesson.level,
      description: lesson.description,
      moves: lesson.moves.split(' '),
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
      isCompleted: lesson.lessonsCompleted.some(
        (lesson) => lesson.userUid === userUid,
      ),
    }));
  }
}
