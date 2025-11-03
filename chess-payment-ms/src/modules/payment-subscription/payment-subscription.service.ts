import { Injectable } from '@nestjs/common';
import { CreatePaymentSubscriptionDto } from './dto/create-payment-subscription.dto';

@Injectable()
export class PaymentSubscriptionService {
  create(createPaymentSubscriptionDto: CreatePaymentSubscriptionDto) {
    return 'This action adds a new paymentSubscription';
  }

  findAll() {
    return `This action returns all paymentSubscription`;
  }

  findOne(id: number) {
    return `This action returns a #${id} paymentSubscription`;
  }
}
