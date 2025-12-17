import { Controller, Get, Inject, UseGuards, Req, Query } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';

import { NATS_SERVICE } from 'src/config';
import { AuthGuard } from 'src/guards/auth.guard';
import { FindNotificationPurchaseByOrderDto } from './dto/find-notification-purchase-by-order.dto';

@Controller('notification-purchase')
export class NotificationPurchaseController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @UseGuards(AuthGuard)
  @Get('/by-order-id')
  findOneByOrderId(
    @Query() dto: FindNotificationPurchaseByOrderDto,
    @Req() req: any,
  ) {
    const payload = {
      ...dto,
      userUid: +req.user.uid,
    };
    return this.client
      .send('notificationPurchase.findOneBy.orderId', payload)
      .pipe(
        catchError((err) => {
          throw new RpcException(err);
        }),
      );
  }

  @UseGuards(AuthGuard)
  @Get('/')
  findAll(@Req() req: any) {
    return this.client
      .send('notificationPurchase.find.one', +req.user.uid)
      .pipe(
        catchError((err) => {
          throw new RpcException(err);
        }),
      );
  }
}
