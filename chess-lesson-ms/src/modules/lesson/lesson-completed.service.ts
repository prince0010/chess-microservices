import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { firstValueFrom } from 'rxjs';

import { NATS_SERVICE } from 'src/config';
import { Lesson } from './entities/lesson.entity';
import { LessonCompleted } from './entities/lesson-completed.entity';
import { CompleteLessonDto } from './dto/complete-lesson.dto';
import { UpdateUserPointsDto } from './dto/update-user-points.dto';
import { CompleteLessonResponse } from './interfaces/index';

@Injectable()
export class LessonCompletedService {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
    @InjectRepository(LessonCompleted)
    private readonly lessonCompletedRepository: Repository<LessonCompleted>,
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
  ) {}

  async completeOne(
    completeLessonDto: CompleteLessonDto,
  ): Promise<CompleteLessonResponse> {
    const { lessonId, userUid } = completeLessonDto;

    try {
      const lesson = await this.lessonRepository.findOneBy({ id: lessonId });
      if (!lesson) {
        throw new BadRequestException(`Lesson with ID: ${lessonId} not found.`);
      }

      const alreadyExistsLessonUser =
        await this.lessonCompletedRepository.findOne({
          where: {
            lesson: { id: lessonId },
            userUid,
          },
          relations: { lesson: true },
        });

      if (alreadyExistsLessonUser) {
        const user = await firstValueFrom(
          this.client.send('auth.findone.user', userUid),
        );

        return {
          message: 'Lesson already was completed. No points earned',
          lastPoints: user.points,
          earnedPoints: 0,
          counter: user.points,
        };
        // throw new BadRequestException(
        //   `Estimated user, you already completed the Lesson with ID: ${lessonId}.`,
        // );
      }

      const newCompletion = this.lessonCompletedRepository.create({
        lesson,
        userUid,
      });

      await this.lessonCompletedRepository.save(newCompletion);

      // Add lesson points to user counter
      const dataPoints: UpdateUserPointsDto = {
        uid: userUid,
        points: lesson.points,
      };
      const { lastPoints, earnedPoints, counter } = await firstValueFrom(
        this.client.send('update.points.user', dataPoints),
      );

      return {
        message: 'Lesson completed successfully.',
        lastPoints,
        earnedPoints,
        counter,
      };
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

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
