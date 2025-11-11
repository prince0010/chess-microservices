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
  ): Promise<PaymentSubscription[]> {
    return this.paymentSubscriptionRepository.find({
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
      const subscriptions = await this.findLatestLevelUnlockSubscription(
        userUid,
        ItemPackage.OPEN_ALL_LEVELS_FOR_30_DAYS,
      );
      if (!subscriptions.length) return false;

      const now = new Date();

      // check if at least one subscription is still active
      for (const sub of subscriptions) {
        const is30Days =
          sub.item.name === ItemPackage.OPEN_ALL_LEVELS_FOR_30_DAYS;
        if (!is30Days) continue;

        const expiresAt = new Date(sub.expiresAt);

        if (expiresAt > now) {
          return true; // Found an active one
        }
      }

      // None active
      return false;
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  async hasActiveLevelsOpenForLifeTime(userUid: number): Promise<boolean> {
    try {
      const subscriptions = await this.findLatestLevelUnlockSubscription(
        userUid,
        ItemPackage.OPEN_ALL_LEVELS_FOR_LIFE_TIME,
      );

      if (!subscriptions.length) return false;

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
