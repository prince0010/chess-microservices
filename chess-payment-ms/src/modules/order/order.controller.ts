import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';

import { OrderService } from './order.service';
import { VerifyInAppPurchaseService } from './verify-in-app-purchase.service';

import {
  FailedOrderAppDto,
  OrderAppPaginationDto,
  VerifyInAppPurchaseDto,
} from './dto';

@Controller()
export class OrdersController {
  constructor(
    private readonly orderService: OrderService,
    private readonly verifyInAppPurchaseService: VerifyInAppPurchaseService,
  ) {}

  // verify in app purchase with google or apple
  @MessagePattern('order.verify.iap')
  async verifyInAppPurchase(@Payload() dto: VerifyInAppPurchaseDto) {
    return await this.verifyInAppPurchaseService.verifyInAppPurchase(dto);
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
