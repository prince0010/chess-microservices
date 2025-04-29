import { Injectable } from '@nestjs/common';
import { CreateTetriDto } from './dto/create-tetri.dto';
import { UpdateTetriDto } from './dto/update-tetri.dto';

@Injectable()
export class TetrisService {
  create(createTetriDto: CreateTetriDto) {
    return 'This action adds a new tetri';
  }

  findAll() {
    return `This action returns all tetris`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tetri`;
  }

  update(id: number, updateTetriDto: UpdateTetriDto) {
    return `This action updates a #${id} tetri`;
  }

  remove(id: number) {
    return `This action removes a #${id} tetri`;
  }
}
