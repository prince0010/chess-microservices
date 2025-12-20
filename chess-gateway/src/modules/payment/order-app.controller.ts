import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';

import { NATS_SERVICE } from 'src/config';
import { AuthGuard } from 'src/guards/auth.guard';

import { VerifyInAppPurchaseDto } from './dto/verify-in-app-purchase.dto';

// for mobile app purchases
@Controller('order-app')
export class OrderAppController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @UseGuards(AuthGuard)
  @Post('/verify-in-app-purchase')
  create(@Body() dto: VerifyInAppPurchaseDto, @Req() req: any) {
    const payload = {
      ...dto,
      userUid: +req.user.uid,
    };

    return this.client.send('order.verify.iap', payload).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @UseGuards(AuthGuard)
  @Get('/exists-purchase-unlock-levels-for-lifetime')
  existsPurchaseUnlockLevelsForLifetime(@Req() req: any) {
    return this.client
      .send('order.existsPurchaseUnlockLevels.lifeTime', +req.user.uid)
      .pipe(
        catchError((err) => {
          throw new RpcException(err);
        }),
      );
  }
}
