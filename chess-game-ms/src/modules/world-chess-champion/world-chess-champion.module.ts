import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NatsModule } from '../transports/nats.module';

import { WorldChessChampionGame } from './entities/world-chess-champion-game.entity';
import { WorldChessChampionLevel } from './entities/world-chess-champion-level.entity';
import { WorldChessChampionLevelCompleted } from './entities/world-chess-champion-level-completed.entity';

import { WorldChessChampionController } from './world-chess-champion.controller';
import { WorldChessChampionService } from './world-chess-champion.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      WorldChessChampionGame,
      WorldChessChampionLevel,
      WorldChessChampionLevelCompleted,
    ]),
    NatsModule,
  ],
  controllers: [WorldChessChampionController],
  providers: [WorldChessChampionService],
})
export class WorldChessChampionModule {}
