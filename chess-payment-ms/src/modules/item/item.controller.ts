import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ItemService } from './item.service';

@Controller()
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @MessagePattern('item.seed.list')
  create() {
    return this.itemService.seedItemsPackages();
  }

  // @MessagePattern('createItem')
  // create(@Payload() createItemDto: CreateItemDto) {
  //   return this.itemService.create(createItemDto);
  // }

  @MessagePattern('item.find.all')
  findAll(@Payload() userUid: number) {
    return this.itemService.findAll(userUid);
  }

  @MessagePattern('item.find.one')
  findOne(@Payload() id: number) {
    return this.itemService.findOne(id);
  }
}
