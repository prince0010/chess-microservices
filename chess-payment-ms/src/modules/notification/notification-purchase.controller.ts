import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { NotificationPurchaseService } from './notification-purchase.service';
import { FindNotificationPurchaseByOrderDto } from './dto/find-notification-purchase-by-order.dto';

@Controller()
export class NotificationPurchaseController {
  constructor(
    private readonly notificationPurchaseService: NotificationPurchaseService,
  ) {}

  // website will ask through a poll in case payment session was triggered
  @MessagePattern('notificationPurchase.find.one')
  findNotificationByPackageName(@Payload() userUid: number) {
    return this.notificationPurchaseService.findOne(userUid);
  }

  // from flutter APP after succeeded In App Purchase
  @MessagePattern('notificationPurchase.findOneBy.orderId')
  findNotificationByOrderId(
    @Payload() dto: FindNotificationPurchaseByOrderDto,
  ) {
    return this.notificationPurchaseService.findOneByOrderId(dto);
  }
}
