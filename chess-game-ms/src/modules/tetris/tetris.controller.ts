import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { TetrisService } from './tetris.service';

import { UpdateTetrisUserHistoryDto } from './dto/update-tetris-user-history.dto';

@Controller()
export class TetrisController {
  constructor(private readonly tetrisService: TetrisService) {}

  @MessagePattern('tetris.find.ranking')
  findRanking(@Payload() userUid: number) {
    return this.tetrisService.findRanking(userUid);
  }

  @MessagePattern('tetris.find.scoreByUser')
  findOneScoreByUser(@Payload() userUid: number) {
    return this.tetrisService.findOneScore(userUid);
  }

  @MessagePattern('tetris.update.scoreByUser')
  update(@Payload() updateTetrisUserHistoryDto: UpdateTetrisUserHistoryDto) {
    return this.tetrisService.updateHistory(updateTetrisUserHistoryDto);
  }
}
