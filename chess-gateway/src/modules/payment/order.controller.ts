import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';

import { NATS_SERVICE } from 'src/config';
import { AdminGuard } from 'src/guards/admin.guard';
import { AuthGuard } from 'src/guards/auth.guard';

import { CreateOrderDto } from './dto/create-order.dto';
import { OrderPaginationDto } from './dto/order-pagination.dto';

@Controller('order')
export class OrderController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @UseGuards(AuthGuard)
  @Post('/create-session')
  create(@Body() createOrderDto: CreateOrderDto, @Req() req: any) {
    const payload = {
      ...createOrderDto,
      userUid: +req.user.uid,
    };
    return this.client.send('order.payment.create', payload).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @UseGuards(AdminGuard)
  @Get('/')
  findAll(@Query() orderPaginationDto: OrderPaginationDto) {
    return this.client.send('order.find.all', orderPaginationDto).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @UseGuards(AdminGuard)
  @Get('/:id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.client.send('order.find.one', id).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }
}
