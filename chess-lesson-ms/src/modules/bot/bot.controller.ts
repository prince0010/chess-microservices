import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { BotService } from './bot.service';
import { CreateBotDto, UpdateBotDto } from './dto/create-bot.dto';

@Controller()
export class BotController {
  constructor(private readonly botService: BotService) {}

  @MessagePattern('bot.create.one')
  create(@Payload() createBotDto: CreateBotDto) {
    return this.botService.createOne(createBotDto);
  }

  // TODO: create this method so it is missing
  @MessagePattern('bot.find.all')
  findAll() {
    return this.botService.findAll();
  }

  @MessagePattern('bot.find.one')
  findOne(@Payload() id: number) {
    return this.botService.findOne(id);
  }

  @MessagePattern('bot.update.one')
  update(@Payload() data: { id: number; updateBotDto: UpdateBotDto }) {
    return this.botService.update(data.id, data.updateBotDto);
  }

  @MessagePattern('bot.remove.one')
  remove(@Payload() id: number) {
    return this.botService.remove(id);
  }
}
