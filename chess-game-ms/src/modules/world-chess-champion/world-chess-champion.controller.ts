import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { WorldChessChampionService } from './world-chess-champion.service';

import { FindAllWorldChessChampionLevelsDto } from './dto/find-all-world-chess-champion-levels.dto';
import { FindOneWorldChessChampionLevelByUserDto } from './dto/find-one-world-chess-champion-level.dto';
import { CompleteWorldChessChampionLevelDto } from './dto/complete-world-chess-champion-level.dto';
import { RunFileSeedWorldChessChampionDto } from './dto/run-file-seed-world-chess-champion.dto';

@Controller()
export class WorldChessChampionController {
  constructor(
    private readonly worldChessChampionService: WorldChessChampionService,
  ) {}

  @MessagePattern('worldChessChampion.seed.levels')
  generate57Levels() {
    return this.worldChessChampionService.generate57Levels();
  }

  @MessagePattern('worldChessChampion.seed.games')
  generateWorldChampionsGames(
    @Payload()
    runFileSeedWorldChessChampionDto: RunFileSeedWorldChessChampionDto,
  ) {
    return this.worldChessChampionService.generatePGNGames(
      runFileSeedWorldChessChampionDto,
    );
  }

  @MessagePattern('worldChessChampion.findAll.levels')
  findAll(
    @Payload()
    findAllWorldChessChampionLevelsDto: FindAllWorldChessChampionLevelsDto,
  ) {
    return this.worldChessChampionService.findAll(
      findAllWorldChessChampionLevelsDto,
    );
  }

  @MessagePattern('worldChessChampion.findOne.level')
  findOne(
    @Payload()
    findOneWorldChessChampionLevelByUserDto: FindOneWorldChessChampionLevelByUserDto,
  ) {
    return this.worldChessChampionService.findOneLevel(
      findOneWorldChessChampionLevelByUserDto,
    );
  }

  @MessagePattern('worldChessChampion.complete.level')
  update(
    @Payload()
    completeWorldChessChampionLevelDto: CompleteWorldChessChampionLevelDto,
  ) {
    return this.worldChessChampionService.completeLevel(
      completeWorldChessChampionLevelDto,
    );
  }

  @MessagePattern('worldChessChampion.counter.completedLevels')
  counterOfLevelsCompleted(@Payload() userUid: number) {
    return this.worldChessChampionService.countHowManyLevelsCompleted(userUid);
  }
}
