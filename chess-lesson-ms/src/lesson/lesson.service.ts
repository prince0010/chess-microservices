import { Injectable } from '@nestjs/common';

@Injectable()
export class LessonService {
  findAll() {
    return `This action returns all src`;
  }

  findOne(id: number) {
    return `This action returns a #${id} src`;
  }
}
