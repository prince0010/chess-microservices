import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AuthStoryUnlocked } from './entities/auth-story-unlocked.entity';

import { StoriesUnlockedResponse, StoryUnlocked } from './interfaces';
import { LessonStoryName } from 'src/enum/index';

@Injectable()
export class AuthStoryUnlockedService {
  constructor(
    @InjectRepository(AuthStoryUnlocked)
    private readonly authStoryUnlockedRepository: Repository<AuthStoryUnlocked>,
  ) {}

  public async findAllStories(
    userUid: number,
  ): Promise<StoriesUnlockedResponse> {
    try {
      const availableStories = [
        LessonStoryName.EDUCATION,
        LessonStoryName.PUZZLE,
        LessonStoryName.ENDGAME,
        LessonStoryName.BOTGAME,
      ];
      const storiesResult: StoryUnlocked[] = [
        {
          story: LessonStoryName.EDUCATION,
          disabled: false,
        },
      ]; // always by default education story is unlocked

      const storiesUnlockedList = await this.authStoryUnlockedRepository.find({
        where: { user: { uid: userUid } },
      });

      for (const story of availableStories) {
        storiesResult.push({
          story,
          disabled: !storiesUnlockedList.some(
            (storyUnlocked) => storyUnlocked.story === story,
          ),
        });
      }

      return {
        stories: storiesResult,
      };
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }
}
