import { Injectable, NotFoundException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Repository } from 'typeorm';

import { Lesson } from './entities/lesson.entity';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateLessonParentDto } from './dto/create-lesson-parent.dto';
import { LessonParent } from './entities/lesson-parent.entity';

@Injectable()
export class LessonParentService {
  constructor(
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
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
}
