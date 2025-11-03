import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NatsModule } from '../transports/nats.module';

import { PaymentSubscription } from './entities/payment-subscription.entity';
import { PaymentSubscriptionController } from './payment-subscription.controller';
import { PaymentSubscriptionService } from './payment-subscription.service';

@Module({
  controllers: [PaymentSubscriptionController],
  providers: [PaymentSubscriptionService],
  imports: [TypeOrmModule.forFeature([PaymentSubscription]), NatsModule],
  exports: [TypeOrmModule],
})
export class PaymentSubscriptionModule {}
