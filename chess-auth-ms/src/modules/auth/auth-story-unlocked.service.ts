import { BadRequestException, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AuthStoryUnlocked } from './entities/auth-story-unlocked.entity';
import { Auth } from './entities/auth.entity';

import { StoriesUnlockedResponse, StoryUnlocked } from './interfaces';
import { LessonStoryName, ModeSomeStoryCanBeUnlocked } from 'src/enum/index';
import { UnlockStoryDto } from './dto/unlock-story.dto';

@Injectable()
export class AuthStoryUnlockedService {
  constructor(
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,
    @InjectRepository(AuthStoryUnlocked)
    private readonly authStoryUnlockedRepository: Repository<AuthStoryUnlocked>,
  ) {}

  public async findAllStories(
    userUid: number,
  ): Promise<StoriesUnlockedResponse> {
    try {
      const availableStories = [
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

  public async unlockStory(unlockStoryDto: UnlockStoryDto): Promise<void> {
    const { userUid, story } = unlockStoryDto;
    try {
      const user = await this.authRepository.findOneBy({ uid: userUid });
      if (!user) {
        throw new BadRequestException(`Not user found with UID: ${userUid}.`);
      }

      const unlockedStoryAlready =
        await this.authStoryUnlockedRepository.findOne({
          where: { user: { uid: userUid }, story },
        });
      if (unlockedStoryAlready || story === LessonStoryName.EDUCATION) return;

      // create new unlocked story row
      const newStoryUnlocked = this.authStoryUnlockedRepository.create({
        story,
        user,
        modeWasUnlocked: ModeSomeStoryCanBeUnlocked.COMPLETING_LESSONS,
      });

      await this.authStoryUnlockedRepository.save(newStoryUnlocked);
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }
}
