import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ItemService } from './item.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@Controller()
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @MessagePattern('createItem')
  create(@Payload() createItemDto: CreateItemDto) {
    return this.itemService.create(createItemDto);
  }

  @MessagePattern('findAllItem')
  findAll() {
    return this.itemService.findAll();
  }

  @MessagePattern('findOneItem')
  findOne(@Payload() id: number) {
    return this.itemService.findOne(id);
  }

  @MessagePattern('updateItem')
  update(@Payload() updateItemDto: UpdateItemDto) {
    return this.itemService.update(updateItemDto.id, updateItemDto);
  }

  @MessagePattern('removeItem')
  remove(@Payload() id: number) {
    return this.itemService.remove(id);
  }
}
