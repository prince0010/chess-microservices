import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { NotificationPurchaseService } from './notification-purchase.service';

@Controller()
export class NotificationPurchaseController {
  constructor(
    private readonly notificationPurchaseService: NotificationPurchaseService,
  ) {}

  // frontend app will ask through a poll in case payment session was triggered
  @MessagePattern('notificationPurchase.find.one')
  findNotificationByPackageName(@Payload() userUid: number) {
    return this.notificationPurchaseService.findOne(userUid);
  }
}
