import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NatsModule } from '../transports/nats.module';

import { PaymentSubscription } from '../payment-subscription/entities/payment-subscription.entity';
import { OrderBookLesson } from './entities/order-book-lesson.entity';
import { OrderBookLessonReceipt } from './entities/order-book-lesson-receipt.entity';

import { OrderBookLessonController } from './order-book-lesson.controller';
import { OrderBookLessonService } from './order-book-lesson.service';

@Module({
  controllers: [OrderBookLessonController],
  providers: [OrderBookLessonService],
  imports: [
    TypeOrmModule.forFeature([
      OrderBookLesson,
      OrderBookLessonReceipt,
      PaymentSubscription,
    ]),
    NatsModule,
  ],
  exports: [TypeOrmModule],
})
export class OrderBookLessonModule {}
// TODO: add this module to app.module when it is ready
