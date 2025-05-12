import { Injectable, NotFoundException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Lesson } from './entities/lesson.entity';

import { transformSingleLessons } from './helpers/transform-lesson.helper';

import { FindOneLessonDto } from './dto/find-one-lesson.dto';
import { ILessonList } from './interfaces';

@Injectable()
export class LessonService {
  constructor(
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
  ) {}

  async findOne(findOneLessonDto: FindOneLessonDto): Promise<ILessonList> {
    const { lessonId, userUid } = findOneLessonDto;

    try {
      const lessonById = await this.lessonRepository.findOne({
        where: { id: lessonId },
      });
      if (!lessonById) {
        throw new NotFoundException(`Lesson by ID: ${lessonId} not found.`);
      }

      return transformSingleLessons([lessonById])[0];
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }
}
