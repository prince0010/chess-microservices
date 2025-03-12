import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { BotService } from './bot.service';
import { CreateBotDto, UpdateBotDto } from './dto/create-bot.dto';

@Controller()
export class BotController {
  constructor(private readonly botService: BotService) {}

  @MessagePattern('createBot')
  create(@Payload() createBotDto: CreateBotDto) {
    return this.botService.create(createBotDto);
  }

  @MessagePattern('findAllBot')
  findAll() {
    return this.botService.findAll();
  }

  @MessagePattern('findOneBot')
  findOne(@Payload() id: number) {
    return this.botService.findOne(id);
  }

  @MessagePattern('updateBot')
  update(@Payload() updateBotDto: UpdateBotDto) {
    return this.botService.update(updateBotDto.id, updateBotDto);
  }

  @MessagePattern('removeBot')
  remove(@Payload() id: number) {
    return this.botService.remove(id);
  }
}
