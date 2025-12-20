import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';

import { OrderBookLessonService } from './order-book-lesson.service';

import {
  CreateOrderBookLessonDto,
  FailedOrderBookLessonDto,
  OrderBookLessonPaginationDto,
  PaidOrderBookLessonDto,
} from './dto';

@Controller()
export class OrderBookLessonController {
  constructor(
    private readonly orderBookLessonService: OrderBookLessonService,
  ) {}

  // first and main endpoint using stripe
  @MessagePattern('orderBookLesson.payment.create')
  async createPaymentSession(
    @Payload() createOrderBookLessonDto: CreateOrderBookLessonDto,
  ) {
    const order = await this.orderBookLessonService.create(
      createOrderBookLessonDto,
    );

    const paymentSession =
      await this.orderBookLessonService.createPaymentSession(order);

    return {
      order,
      paymentSession,
    };
  }

  @MessagePattern('orderBookLesson.find.all')
  findAll(
    @Payload() orderBookLessonPaginationDto: OrderBookLessonPaginationDto,
  ) {
    return this.orderBookLessonService.findAll(orderBookLessonPaginationDto);
  }

  @MessagePattern('orderBookLesson.find.one')
  findOne(@Payload('id') id: string) {
    return this.orderBookLessonService.findOne(id);
  }

  // from payment service webhook endpoint to update status as paid
  @EventPattern('orderBookLesson.payment.succeeded')
  paidOrder(@Payload() paidOrderBookLessonDto: PaidOrderBookLessonDto) {
    return this.orderBookLessonService.markOrderBookLessonAsPaid(
      paidOrderBookLessonDto,
    );
  }

  // from payment service webhook endpoint to update status as failed
  @EventPattern('orderBookLesson.payment.failed')
  failedOrder(@Payload() failedOrderBookLessonDto: FailedOrderBookLessonDto) {
    return this.orderBookLessonService.markOrderBookLessonAsFailed(
      failedOrderBookLessonDto,
    );
  }
}
