import {
  Body,
  Controller,
  Get,
  Inject,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';

import { NATS_SERVICE } from 'src/config';
import { AuthGuard } from 'src/guards/auth.guard';
import { InAppPurchaseRequestDto } from './dto/in-app-purchase-request.dto';

// for mobile app purchases
@Controller('order-app')
export class OrderAppController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @UseGuards(AuthGuard)
  @Get('/player-go-to-purchase')
  playerGoToCheckoutFromApp(
    @Query('itemId', ParseIntPipe) itemId: number,
    @Query('source') source: string,
    @Req() req: any,
  ) {
    const payload = {
      itemId,
      source,
      userUid: +req.user.uid,
    };

    return this.client.send('order.player.goToPurchase', payload).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @UseGuards(AuthGuard)
  @Post('/in-app-purchase-request')
  create(@Body() dto: InAppPurchaseRequestDto, @Req() req: any) {
    const payload = {
      ...dto,
      userUid: +req.user.uid,
    };

    return this.client.send('order.newRequest.iap', payload).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }
}
