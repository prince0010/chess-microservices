import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { GuessPositionService } from './guess-position.service';

import { UpdateGuessPositionUserHistoryDto } from './dto/update-guess-position-user-history.dto';

@Controller()
export class GuessPositionController {
  constructor(private readonly guessPositionService: GuessPositionService) {}

  @MessagePattern('guessPosition.find.ranking')
  findRanking(@Payload() userUid: number) {
    return this.guessPositionService.findRanking(userUid);
  }

  @MessagePattern('guessPosition.find.scoreByUser')
  findOneScoreByUser(@Payload() userUid: number) {
    return this.guessPositionService.findOneScore(userUid);
  }

  @MessagePattern('guessPosition.update.scoreByUser')
  update(
    @Payload()
    updateGuessPositionUserHistoryDto: UpdateGuessPositionUserHistoryDto,
  ) {
    return this.guessPositionService.updateHistory(
      updateGuessPositionUserHistoryDto,
    );
  }
}
