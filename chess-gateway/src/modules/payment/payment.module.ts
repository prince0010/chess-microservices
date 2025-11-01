import { Module } from '@nestjs/common';

import { NatsModule } from '../transports/nats.module';
import { PaymentController } from './payment.controller';
import { ItemController } from './item.controller';
import { OrderController } from './order.controller';
import { NotificationPurchaseController } from './notification-purchase.controller';

@Module({
  controllers: [
    PaymentController,
    ItemController,
    OrderController,
    NotificationPurchaseController,
  ],
  providers: [],
  imports: [NatsModule],
})
export class PaymentModule {}
