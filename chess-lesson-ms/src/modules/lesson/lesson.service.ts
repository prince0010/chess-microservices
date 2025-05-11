import { Injectable, NotFoundException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Lesson } from './entities/lesson.entity';
import { FindOneLessonDto } from './dto/find-one-lesson.dto';

@Injectable()
export class LessonService {
  constructor(
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
  ) {}

  async findOne(findOneLessonDto: FindOneLessonDto): Promise<Lesson> {
    const { lessonId, userUid } = findOneLessonDto;

    try {
      const lessonById = await this.lessonRepository.findOne({
        where: { id: lessonId },
        relations: { lessonsCompleted: true },
      });
      if (!lessonById) {
        throw new NotFoundException(`Lesson by ID: ${lessonById} not found.`);
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
