import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';

import { OrderService } from './order.service';

import {
  FailedOrderAppDto,
  InAppPurchaseRequestDto,
  OrderAppPaginationDto,
} from './dto';
import { IapService } from './iap.service';

@Controller()
export class OrdersController {
  constructor(
    private readonly orderService: OrderService,
    private readonly iapService: IapService,
  ) {}

  // new request in app purchase from google or apple
  @MessagePattern('order.newRequest.iap')
  async newRequestInAppPurchase(@Payload() dto: InAppPurchaseRequestDto) {
    return await this.iapService.newRequestInAppPurchase(dto);
  }

  @MessagePattern('order.find.all')
  findAll(@Payload() dto: OrderAppPaginationDto) {
    return this.orderService.findAll(dto);
  }

  @MessagePattern('order.find.one')
  findOne(@Payload('id') id: string) {
    return this.orderService.findOne(id);
  }

  @MessagePattern('order.existsPurchaseUnlockLevels.lifeTime')
  existsPurchaseUnlockLevelsLifeTime(@Payload() userUid: number) {
    return this.orderService.existPurchaseUnlockLevelsForLifeTime(userUid);
  }

  // from payment service webhook endpoint to update status as failed
  @EventPattern('order.payment.failed')
  failedOrder(@Payload() dto: FailedOrderAppDto) {
    return this.orderService.markOrderAppAsFailed(dto);
  }
}
