import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';

import { NATS_SERVICE } from 'src/config';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('payment')
export class PaymentController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @UseGuards(AuthGuard)
  @Post('/')
  findOne(@Req() req: any) {
    // const payload = {
    //   // missing data order
    //   userUid: +req.user.uid,
    // };
    // return this.client.send('payment.create.session', payload).pipe(
    //   catchError((err) => {
    //     throw new RpcException(err);
    //   }),
    // );
  }
}
