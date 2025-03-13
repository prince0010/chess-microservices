import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Bot } from './entities/bot.entity';
import { BotUserHistory } from './entities/bot-user-history.entity';

import { BotService } from './bot.service';
import { BotController } from './bot.controller';

@Module({
  controllers: [BotController],
  providers: [BotService],
  imports: [TypeOrmModule.forFeature([Bot, BotUserHistory])],
  exports: [TypeOrmModule],
})
export class BotModule {}
