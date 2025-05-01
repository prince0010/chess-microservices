import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TetrisUserHistory } from './entities/tetris-user-history.entity';

import { NatsModule } from '../transports/nats.module';
import { TetrisController } from './tetris.controller';
import { TetrisService } from './tetris.service';

@Module({
  imports: [TypeOrmModule.forFeature([TetrisUserHistory]), NatsModule],
  controllers: [TetrisController],
  providers: [TetrisService],
})
export class TetrisModule {}
