import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthStoryUnlockedService } from './auth-story-unlocked.service';

@Controller('auth-story-unlocked')
export class AuthStoryUnlockedController {
  constructor(
    private readonly authStoryUnlockedService: AuthStoryUnlockedService,
  ) {}

  @MessagePattern('auth.findAll.stories')
  findAllStories(@Payload() userUid: number) {
    return this.authStoryUnlockedService.findAllStories(userUid);
  }
}
