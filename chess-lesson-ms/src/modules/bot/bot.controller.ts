import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { BotService } from './bot.service';

import { CreateBotDto, UpdateBotDto } from './dto/create-bot.dto';
import { FindAllBotsDto } from './dto/find-all-bots.dto';
import { CounterBotUserHistoryDto } from './dto/counter-bot-user-history.dto';
import { FindOneBotDto } from './dto/find-one-bot.dto';

@Controller()
export class BotController {
  constructor(private readonly botService: BotService) {}

  @MessagePattern('bot.seed.animals')
  seedAnimalBots() {
    return this.botService.generateAnimalBots();
  }

  @MessagePattern('bot.create.one')
  create(@Payload() createBotDto: CreateBotDto) {
    return this.botService.createOne(createBotDto);
  }

  @MessagePattern('bot.find.all')
  findAll(@Payload() findAllBotsDto: FindAllBotsDto) {
    return this.botService.findAll(findAllBotsDto);
  }

  @MessagePattern('bot.find.one')
  findOne(@Payload() findOneBotDto: FindOneBotDto) {
    return this.botService.findOne(findOneBotDto);
  }

  @MessagePattern('bot.update.one')
  update(@Payload() data: { id: number; updateBotDto: UpdateBotDto }) {
    return this.botService.update(data.id, data.updateBotDto);
  }

  @MessagePattern('bot.remove.one')
  remove(@Payload() id: number) {
    return this.botService.remove(id);
  }

  @MessagePattern('bot.user.updateHistory')
  updateBotUserCounter(
    @Payload() counterBotUserHistoryDto: CounterBotUserHistoryDto,
  ) {
    return this.botService.updateHistoryByUser(counterBotUserHistoryDto);
  }
}
