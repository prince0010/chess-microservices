import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { AuthRankingService } from './auth-ranking.service';

@Controller()
export class AuthRankingController {
  constructor(private readonly authRankingService: AuthRankingService) {}

  @MessagePattern('auth.ranking.educationLessons')
  rankingByEducationLessons(@Payload() userUid: number) {
    return this.authRankingService.rankingByEducationLessons(userUid);
  }

  @MessagePattern('auth.ranking.puzzleLessons')
  rankingByPuzzleLessons(@Payload() userUid: number) {
    return this.authRankingService.rankingByPuzzleLessons(userUid);
  }

  @MessagePattern('auth.ranking.endgamesLessons')
  rankingByEndgamesLessons(@Payload() userUid: number) {
    return this.authRankingService.rankingByEndgamesLessons(userUid);
  }

  @MessagePattern('auth.ranking.animalBots')
  rankingByAnimalBots(@Payload() userUid: number) {
    return this.authRankingService.rankingByAnimalBots(userUid);
  }
}
