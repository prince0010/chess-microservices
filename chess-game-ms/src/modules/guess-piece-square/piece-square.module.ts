import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NatsModule } from '../transports/nats.module';

import { PieceSquareLevel } from './entities/piece-square-level.entity';
import { PieceSquareLevelCompleted } from './entities/piece-square-level-completed.entity';
import { PieceSquareController } from './piece-square.controller';
import { PieceSquareService } from './piece-square.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PieceSquareLevel, PieceSquareLevelCompleted]),
    NatsModule,
  ],
  controllers: [PieceSquareController],
  providers: [PieceSquareService],
})
export class PieceSquareModule {}
