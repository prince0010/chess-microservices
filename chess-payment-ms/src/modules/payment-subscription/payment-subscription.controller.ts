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

  // return true or false if user authenticated has this subscription alive
  @MessagePattern('paymentSubscription.levelsFor30Days.active')
  findIfActiveSubscriptionFor30Days(@Payload() userUid: number) {
    return this.paymentSubscriptionService.hasActiveLevelsOpenFor30Days(
      userUid,
    );
  }

  // return true or false if user authenticated has this subscription alive
  @MessagePattern('paymentSubscription.levelsForLifeTime.active')
  findIfActiveSubscriptionForLifeTime(@Payload() userUid: number) {
    return this.paymentSubscriptionService.hasActiveLevelsOpenForLifeTime(
      userUid,
    );
  }
}
