import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';

import { OrderService } from './order.service';

import { CreateOrderDto } from './dto/create-order.dto';
import { OrderPaginationDto } from './dto/order-pagination.dto';
import { ChangeOrderStatusDto } from './dto/change-order-status.dto';
import { PaidOrderDto } from './dto/paid-order.dto';

@Controller()
export class OrdersController {
  constructor(private readonly orderService: OrderService) {}

  // @MessagePattern('createOrder')
  // async create(@Payload() createOrderDto: CreateOrderDto) {
  //   const order = await this.orderService.create(createOrderDto);

  //   const paymentSession = this.orderService.createPaymentSession(order);

  //   return {
  //     order,
  //     paymentSession,
  //   };
  // }

  // @MessagePattern('findAllOrders')
  // findAll(@Payload() orderPaginationDto: OrderPaginationDto) {
  //   return this.orderService.findAll(orderPaginationDto);
  // }

  // @MessagePattern('findOneOrder')
  // findOne(@Payload('id') id: string) {
  //   return this.orderService.findOne(id);
  // }

  // @MessagePattern('changeOrderStatus')
  // changeOrderStatus(@Payload() changeOrderStatusDto: ChangeOrderStatusDto) {
  //   return this.orderService.changeStatus(changeOrderStatusDto);
  // }

  // // one order was paid
  // @EventPattern('payment.succeeded')
  // paidOrder(@Payload() paidOrderDto: PaidOrderDto) {
  //   return this.orderService.markOrderAsPaid(paidOrderDto);
  // }
}
