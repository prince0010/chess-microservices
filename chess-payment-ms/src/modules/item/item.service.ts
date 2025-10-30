import { BadRequestException, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { Item } from './entities/item.entity';
import { listItems } from './seed/list-item.seed';

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

  async validateItems(itemIdsArray: number[]): Promise<Item[]> {
    try {
      const ids = Array.from(new Set(itemIdsArray));
      const [items, total] = await this.itemRepository.findAndCount({
        where: { id: In(ids), isActive: true },
      });

      if (total !== ids.length) {
        throw new BadRequestException(`Some items were not found.`);
      }

      return items;
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
        where: { isActive: true },
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
