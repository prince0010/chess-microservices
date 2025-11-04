import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { NATS_SERVICE } from 'src/config';
import { AuthStoryUnlocked } from './entities/auth-story-unlocked.entity';
import { Auth } from './entities/auth.entity';

import { StoriesUnlockedResponse, StoryUnlocked } from './interfaces';
import { LessonStoryName, ModeSomeStoryCanBeUnlocked } from 'src/enum/index';
import { UnlockStoryDto } from './dto/unlock-story.dto';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthStoryUnlockedService {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
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

      // verify payment subscription before looping unlocked stories
      const subscriptionLifetime = await firstValueFrom(
        this.client.send(
          'paymentSubscription.levelsForLifeTime.active',
          userUid,
        ),
      ).catch(() => false);

      const subscription30Days = !subscriptionLifetime
        ? await firstValueFrom(
            this.client.send(
              'paymentSubscription.levelsFor30Days.active',
              userUid,
            ),
          ).catch(() => false)
        : false;

      const hasActiveSubscription = subscriptionLifetime || subscription30Days;

      for (const story of availableStories) {
        storiesResult.push({
          story,
          disabled: hasActiveSubscription
            ? false
            : !storiesUnlockedList.some(
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
