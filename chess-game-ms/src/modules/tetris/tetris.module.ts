import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NatsModule } from '../transports/nats.module';
import { TetrisController } from './tetris.controller';
import { TetrisService } from './tetris.service';

@Module({
  imports: [TypeOrmModule.forFeature([]), NatsModule],
  controllers: [TetrisController],
  providers: [TetrisService],
})
export class TetrisModule {}
