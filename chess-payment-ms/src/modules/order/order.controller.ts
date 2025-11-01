import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';

import { OrderService } from './order.service';

import { CreateOrderDto } from './dto/create-order.dto';
import { OrderPaginationDto } from './dto/order-pagination.dto';
import { FailedOrderDto, PaidOrderDto } from './dto/paid-order.dto';

@Controller()
export class OrdersController {
  constructor(private readonly orderService: OrderService) {}

  // first and main endpoint
  @MessagePattern('order.payment.create')
  async createPaymentSession(@Payload() createOrderDto: CreateOrderDto) {
    const order = await this.orderService.create(createOrderDto);

    const paymentSession = await this.orderService.createPaymentSession(order);

    return {
      order,
      paymentSession,
    };
  }

  @MessagePattern('order.find.all')
  findAll(@Payload() orderPaginationDto: OrderPaginationDto) {
    return this.orderService.findAll(orderPaginationDto);
  }

  @MessagePattern('order.find.one')
  findOne(@Payload('id') id: string) {
    return this.orderService.findOne(id);
  }

  // from payment service webhook endpoint to update status as paid
  @EventPattern('order.payment.succeeded')
  paidOrder(@Payload() paidOrderDto: PaidOrderDto) {
    return this.orderService.markOrderAsPaid(paidOrderDto);
  }

  // from payment service webhook endpoint to update status as failed
  @EventPattern('order.payment.failed')
  failedOrder(@Payload() failedOrderDto: FailedOrderDto) {
    return this.orderService.markOrderAsFailed(failedOrderDto);
  }
}
