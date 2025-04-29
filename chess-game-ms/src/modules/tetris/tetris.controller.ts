import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TetrisService } from './tetris.service';
import { CreateTetriDto } from './dto/create-tetri.dto';
import { UpdateTetriDto } from './dto/update-tetri.dto';

@Controller()
export class TetrisController {
  constructor(private readonly tetrisService: TetrisService) {}

  @MessagePattern('createTetri')
  create(@Payload() createTetriDto: CreateTetriDto) {
    return this.tetrisService.create(createTetriDto);
  }

  @MessagePattern('findAllTetris')
  findAll() {
    return this.tetrisService.findAll();
  }

  @MessagePattern('findOneTetri')
  findOne(@Payload() id: number) {
    return this.tetrisService.findOne(id);
  }

  @MessagePattern('updateTetri')
  update(@Payload() updateTetriDto: UpdateTetriDto) {
    return this.tetrisService.update(updateTetriDto.id, updateTetriDto);
  }

  @MessagePattern('removeTetri')
  remove(@Payload() id: number) {
    return this.tetrisService.remove(id);
  }
}
