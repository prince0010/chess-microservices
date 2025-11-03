import { BadRequestException, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PaymentSubscription } from './entities/payment-subscription.entity';
import { CreatePaymentSubscriptionDto } from './dto/create-payment-subscription.dto';
import { Item } from '../item/entities/item.entity';

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

  findAll() {
    return `This action returns all paymentSubscription`;
  }

  findOne(id: number) {
    return `This action returns a #${id} paymentSubscription`;
  }
}
