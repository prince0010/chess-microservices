import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { PieceSquareService } from './piece-square.service';

import { CompletePieceSquareLevelDto } from './dto/complete-piece-square-level.dto';
import { FindAllPieceSquareLevelsDto } from './dto/find-all-piece-square-levels.dto';
import { FindOnePieceSquareLevelByUserDto } from './dto/find-one-piece-square-level.dto';

@Controller()
export class PieceSquareController {
  constructor(private readonly pieceSquareService: PieceSquareService) {}

  @MessagePattern('pieceSquare.seed.level')
  generate32Levels() {
    return this.pieceSquareService.generate32Levels();
  }

  @MessagePattern('pieceSquare.findAll.level')
  findAll(@Payload() findAllPieceSquareLevelsDto: FindAllPieceSquareLevelsDto) {
    return this.pieceSquareService.findAll(findAllPieceSquareLevelsDto);
  }

  @MessagePattern('pieceSquare.findOne.level')
  findOne(
    @Payload()
    findOnePieceSquareLevelByUserDto: FindOnePieceSquareLevelByUserDto,
  ) {
    return this.pieceSquareService.findOneLevel(
      findOnePieceSquareLevelByUserDto,
    );
  }

  @MessagePattern('pieceSquare.complete.level')
  update(@Payload() completePieceSquareLevelDto: CompletePieceSquareLevelDto) {
    return this.pieceSquareService.completeLevel(completePieceSquareLevelDto);
  }

  @MessagePattern('pieceSquare.counter.completedLevels')
  counterOfLevelsCompleted(@Payload() userUid: number) {
    return this.pieceSquareService.countHowManyLevelsCompleted(userUid);
  }
}
