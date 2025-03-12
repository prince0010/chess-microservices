import { Injectable } from '@nestjs/common';
import { CreateBotDto, UpdateBotDto } from './dto/create-bot.dto';

@Injectable()
export class BotService {
  create(createBotDto: CreateBotDto) {
    return 'This action adds a new bot';
  }

  findAll() {
    return `This action returns all bot`;
  }

  findOne(id: number) {
    return `This action returns a #${id} bot`;
  }

  update(id: number, updateBotDto: UpdateBotDto) {
    return `This action updates a #${id} bot`;
  }

  remove(id: number) {
    return `This action removes a #${id} bot`;
  }
}
