import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { BotRecordGameService } from './bot-record-game.service';

import { CreateRecordBotUserGameDto } from './dto/create-record-bot-user-game.dto';
import { FindAllBotRecordGamesDto } from './dto/find-all-bot-record-games.dto';
import { UpdateRecordBotUserGameDto } from './dto/update-record-bot-user-game.dto';

@Controller()
export class BotRecordGameController {
  constructor(private readonly botRecordGameService: BotRecordGameService) {}

  @MessagePattern('botRecordGame.save.one')
  create(@Payload() createRecordBotUserGameDto: CreateRecordBotUserGameDto) {
    return this.botRecordGameService.saveGame(createRecordBotUserGameDto);
  }

  @MessagePattern('botRecordGame.find.all')
  findAll(@Payload() findAllBotRecordGamesDto: FindAllBotRecordGamesDto) {
    return this.botRecordGameService.findAll(findAllBotRecordGamesDto);
  }

  @MessagePattern('botRecordGame.find.one')
  findOne(@Payload() data: any) {
    return this.botRecordGameService.findOne(data.botRecordGameId);
  }

  @MessagePattern('botRecordGame.update.one')
  update(
    @Payload()
    data: {
      id: number;
      updateRecordBotUserGameDto: UpdateRecordBotUserGameDto;
    },
  ) {
    return this.botRecordGameService.update(
      data.id,
      data.updateRecordBotUserGameDto,
    );
  }
}
