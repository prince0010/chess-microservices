import { Injectable, NotFoundException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { FindManyOptions, Repository } from 'typeorm';

import { Lesson } from './entities/lesson.entity';
import { FindAllLessonsDto } from './dto/find-all-lessons.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ICountAndListLessons } from './interfaces/lesson.interface';

@Injectable()
export class LessonService {
  constructor(
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
  ) {}

  async findAll(
    findAllLessonsDto: FindAllLessonsDto,
  ): Promise<ICountAndListLessons> {
    const { limit = 10, page = 1, id = null, level = null } = findAllLessonsDto;

    const offset = (page - 1) * limit;

    const findOptions: FindManyOptions<Lesson> = {
      take: limit,
      skip: offset,
      order: {
        id: 'ASC',
      },
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
        lessons,
      };
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  async findOne(id: number): Promise<Lesson> {
    try {
      const lessonById = await this.lessonRepository.findOneBy({ id });
      if (!lessonById) {
        throw new NotFoundException(`Lesson by ID: ${id} not found.`);
      }

      return lessonById;
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }
}
