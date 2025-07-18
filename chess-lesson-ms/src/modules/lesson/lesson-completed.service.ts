import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { NATS_SERVICE } from 'src/config';
import { Lesson } from './entities/lesson.entity';
import { LessonCompleted } from './entities/lesson-completed.entity';

@Injectable()
export class LessonCompletedService {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
    @InjectRepository(LessonCompleted)
    private readonly lessonCompletedRepository: Repository<LessonCompleted>,
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
  ) {}

  async findAllByUser(userUid: number): Promise<number[]> {
    try {
      const lessonsCompleted = await this.lessonCompletedRepository.find({
        where: {
          userUid,
        },
        relations: { lesson: true },
      });

      if (!lessonsCompleted) {
        return [];
      }

      return lessonsCompleted.map((lessonCompleted) => lessonCompleted.id);
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }
}
