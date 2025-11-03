import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PaymentSubscriptionService } from './payment-subscription.service';
import { CreatePaymentSubscriptionDto } from './dto/create-payment-subscription.dto';

@Controller()
export class PaymentSubscriptionController {
  constructor(
    private readonly paymentSubscriptionService: PaymentSubscriptionService,
  ) {}

  // only called from order service markOrderAsPaid
  @MessagePattern('paymentSubscription.create.one')
  create(
    @Payload() createPaymentSubscriptionDto: CreatePaymentSubscriptionDto,
  ) {
    return this.paymentSubscriptionService.create(createPaymentSubscriptionDto);
  }

  @MessagePattern('findAllPaymentSubscription')
  findAll() {
    return this.paymentSubscriptionService.findAll();
  }

  @MessagePattern('findOnePaymentSubscription')
  findOne(@Payload() id: number) {
    return this.paymentSubscriptionService.findOne(id);
  }
}
