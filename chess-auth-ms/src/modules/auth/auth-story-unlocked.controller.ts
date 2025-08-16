import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { AuthStoryUnlockedService } from './auth-story-unlocked.service';
import { UnlockStoryDto } from './dto/unlock-story.dto';

@Controller()
export class AuthStoryUnlockedController {
  constructor(
    private readonly authStoryUnlockedService: AuthStoryUnlockedService,
  ) {}

  @MessagePattern('auth.findAll.stories')
  findAllStories(@Payload() userUid: number) {
    return this.authStoryUnlockedService.findAllStories(userUid);
  }

  @EventPattern('auth.unlock.story')
  unlockStory(@Payload() unlockStoryDto: UnlockStoryDto) {
    return this.authStoryUnlockedService.unlockStory(unlockStoryDto);
  }
}
