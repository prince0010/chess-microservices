import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NatsModule } from '../transports/nats.module';
import { ItemController } from './item.controller';
import { ItemService } from './item.service';
import { Item } from './entities/item.entity';

@Module({
  controllers: [ItemController],
  providers: [ItemService],
  imports: [TypeOrmModule.forFeature([Item]), NatsModule],
  exports: [TypeOrmModule, ItemService],
})
export class ItemModule {}
