import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GuessPositionUserHistory } from './entities/guess-position-user-history.entity';

import { NatsModule } from '../transports/nats.module';
import { GuessPositionController } from './guess-position.controller';
import { GuessPositionService } from './guess-position.service';

@Module({
  imports: [TypeOrmModule.forFeature([GuessPositionUserHistory]), NatsModule],
  controllers: [GuessPositionController],
  providers: [GuessPositionService],
})
export class GuessPositionModule {}
