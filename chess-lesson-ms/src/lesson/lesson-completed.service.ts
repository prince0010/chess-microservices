import { BadRequestException, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { LessonCompleted } from './entities/lesson-completed.entity';
import { LessonService } from './lesson.service';
import { CompleteLessonDto } from './dto/complete-lesson.dto';

@Injectable()
export class LessonCompletedService {
  constructor(
    @InjectRepository(LessonCompleted)
    private readonly lessonCompletedRepository: Repository<LessonCompleted>,

    private readonly lessonService: LessonService,
  ) {}

  async completeOne(completeLessonDto: CompleteLessonDto): Promise<string> {
    const { lessonId, userUid } = completeLessonDto;

    try {
      const lesson = await this.lessonService.findOne(lessonId);
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
        throw new BadRequestException(
          `Estimated user, you already completed the Lesson with ID: ${lessonId}.`,
        );
      }

      const newCompletion = this.lessonCompletedRepository.create({
        lesson,
        userUid,
      });

      await this.lessonCompletedRepository.save(newCompletion);

      return `Lesson completed successfully.`;
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
