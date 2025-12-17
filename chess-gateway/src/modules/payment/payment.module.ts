import { Module } from '@nestjs/common';

import { NatsModule } from '../transports/nats.module';
import { PaymentController } from './payment.controller';
import { ItemController } from './item.controller';
import { OrderBookLessonController } from './order-book-lesson.controller';
import { NotificationPurchaseController } from './notification-purchase.controller';
import { OrderAppController } from './order-app.controller';

@Module({
  controllers: [
    PaymentController,
    ItemController,
    OrderBookLessonController,
    OrderAppController,
    NotificationPurchaseController,
  ],
  providers: [],
  imports: [NatsModule],
})
export class PaymentModule {}
