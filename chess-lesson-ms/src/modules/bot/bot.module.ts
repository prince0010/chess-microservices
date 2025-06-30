import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NatsModule } from '../transports/nats.module';

import { Bot } from './entities/bot.entity';
import { BotUserRecordGame } from './entities/bot-user-record-game.entity';
import { BotUserHistory } from './entities/bot-user-history.entity';

import { BotController } from './bot.controller';
import { BotRecordGameController } from './bot-record-game.controller';
import { BotService } from './bot.service';
import { BotRecordGameService } from './bot-record-game.service';

@Module({
  controllers: [BotController, BotRecordGameController],
  providers: [BotService, BotRecordGameService],
  imports: [
    TypeOrmModule.forFeature([Bot, BotUserHistory, BotUserRecordGame]),
    NatsModule,
  ],
  exports: [TypeOrmModule],
})
export class BotModule {}
