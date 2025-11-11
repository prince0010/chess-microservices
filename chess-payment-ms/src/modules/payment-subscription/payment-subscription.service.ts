import { BadRequestException, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PaymentSubscription } from './entities/payment-subscription.entity';
import { Item } from '../item/entities/item.entity';

import { CreatePaymentSubscriptionDto } from './dto/create-payment-subscription.dto';
import { ItemPackage, ItemType } from 'src/enum';

@Injectable()
export class PaymentSubscriptionService {
  constructor(
    @InjectRepository(PaymentSubscription)
    private paymentSubscriptionRepository: Repository<PaymentSubscription>,
    @InjectRepository(Item)
    private itemRepository: Repository<Item>,
  ) {}

  async create(
    createPaymentSubscriptionDto: CreatePaymentSubscriptionDto,
  ): Promise<void> {
    const {
      userUid,
      durationDays = null,
      itemId,
    } = createPaymentSubscriptionDto;
    try {
      // 1. validate item exists
      const item = await this.itemRepository.findOneBy({ id: itemId });
      if (!item) {
        throw new BadRequestException(`Item with ID: ${itemId} not found.`);
      }

      const newPaymentSubscription = this.paymentSubscriptionRepository.create({
        userUid,
        durationDays,
        item,
      });

      const savedPaymentSubscription =
        await this.paymentSubscriptionRepository.save(newPaymentSubscription);
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  private async findLatestLevelUnlockSubscription(
    userUid: number,
    name: string,
  ) {
    return this.paymentSubscriptionRepository.findOne({
      where: {
        userUid,
        item: { type: ItemType.LEVELS_UNLOCK, name },
      },
      relations: { item: true },
      order: { startedAt: 'DESC' },
    });
  }

  async hasActiveLevelsOpenFor30Days(userUid: number): Promise<boolean> {
    try {
      const subscription = await this.findLatestLevelUnlockSubscription(
        userUid,
        ItemPackage.OPEN_ALL_LEVELS_FOR_30_DAYS,
      );
      if (!subscription) return false;

      const is30Days =
        subscription.item.name === ItemPackage.OPEN_ALL_LEVELS_FOR_30_DAYS;
      if (!is30Days) return false;

      const startedAt = new Date(subscription.startedAt);
      const duration =
        subscription.durationDays ?? subscription.item.durationDays ?? 0;

      const expiresAt = new Date(startedAt);
      expiresAt.setDate(expiresAt.getDate() + duration);

      return expiresAt > new Date();
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  async hasActiveLevelsOpenForLifeTime(userUid: number): Promise<boolean> {
    try {
      const subscription = await this.findLatestLevelUnlockSubscription(
        userUid,
        ItemPackage.OPEN_ALL_LEVELS_FOR_LIFE_TIME,
      );

      if (!subscription) return false;

      const isLifetime =
        subscription.item.name === ItemPackage.OPEN_ALL_LEVELS_FOR_LIFE_TIME;
      if (!isLifetime) return false;

      // Life time unlock = always active once purchased
      return true;
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }
}
