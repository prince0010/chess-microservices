import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NatsModule } from '../transports/nats.module';
import { GuessPieceSquareUserHistory } from './entities/guess-piece-square-user-history.entity';
import { PieceSquareController } from './piece-square.controller';
import { PieceSquareService } from './piece-square.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([GuessPieceSquareUserHistory]),
    NatsModule,
  ],
  controllers: [PieceSquareController],
  providers: [PieceSquareService],
})
export class PieceSquareModule {}
