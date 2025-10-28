import { BadRequestException, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Item } from './entities/item.entity';
import { listItems } from './seed/list-item.seed';

import { UpdateItemDto } from './dto/update-item.dto';

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(Item)
    private itemRepository: Repository<Item>,
  ) {}

  async seedItemsPackages(): Promise<string> {
    try {
      const insertedItemsArr: string[] = [];
      for (const item of listItems) {
        const { name, ...restItem } = item;
        // STEP 1: avoid duplicate insertion of item
        const existItem = await this.itemRepository.findOne({
          where: { name: name },
        });

        if (existItem) {
          continue;
        }

        // STEP 2: insert item
        await this.itemRepository.save({
          name,
          ...restItem,
        });

        insertedItemsArr.push(name);
      }

      return `These items were inserted: [${insertedItemsArr.join(', ')}]`;
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  async findAll(): Promise<Item[]> {
    try {
      return await this.itemRepository.find({
        where: {},
      });
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  async findOne(id: number): Promise<Item> {
    try {
      const item = await this.itemRepository.findOneBy({ id });
      if (!item) {
        throw new BadRequestException(`Item with ID: ${id} not found.`);
      }

      return item;
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  remove(id: number) {
    return `This action removes a #${id} item`;
  }
}
