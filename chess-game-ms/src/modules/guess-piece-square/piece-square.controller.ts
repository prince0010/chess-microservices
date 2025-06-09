import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { PieceSquareService } from './piece-square.service';

import { UpdatePieceSquareUserHistoryDto } from './dto/update-piece-square-user-history.dto';

@Controller()
export class PieceSquareController {
  constructor(private readonly pieceSquareService: PieceSquareService) {}

  @MessagePattern('pieceSquare.find.ranking')
  findRanking(@Payload() userUid: number) {
    return this.pieceSquareService.findRanking(userUid);
  }

  @MessagePattern('pieceSquare.find.scoreByUser')
  findOneScoreByUser(@Payload() userUid: number) {
    return this.pieceSquareService.findOneScore(userUid);
  }

  @MessagePattern('pieceSquare.update.scoreByUser')
  update(
    @Payload() updatePieceSquareUserHistoryDto: UpdatePieceSquareUserHistoryDto,
  ) {
    return this.pieceSquareService.updateHistory(
      updatePieceSquareUserHistoryDto,
    );
  }
}
