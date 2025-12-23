import { Module } from '@nestjs/common';

import { NatsModule } from '../transports/nats.module';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { PaymentAppleService } from './payment-apple.service';
import { PaymentStripeService } from './payment-stripe.service';

@Module({
  controllers: [PaymentController],
  providers: [PaymentService, PaymentAppleService, PaymentStripeService],
  imports: [NatsModule],
})
export class PaymentModule {}
