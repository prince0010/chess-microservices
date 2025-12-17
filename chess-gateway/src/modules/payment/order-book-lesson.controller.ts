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

import { CreateOrderBookLessonDto } from './dto/create-order-book-lesson.dto';
import { OrderBookLessonPaginationDto } from './dto/order-book-lesson-pagination.dto';

@Controller('order-book-lesson')
export class OrderBookLessonController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @UseGuards(AuthGuard)
  @Post('/create-session')
  create(@Body() dto: CreateOrderBookLessonDto, @Req() req: any) {
    const payload = {
      ...dto,
      userUid: +req.user.uid,
    };
    return this.client.send('orderBookLesson.payment.create', payload).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @UseGuards(AdminGuard)
  @Get('/')
  findAll(@Query() dto: OrderBookLessonPaginationDto) {
    return this.client.send('orderBookLesson.find.all', dto).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @UseGuards(AdminGuard)
  @Get('/:id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.client.send('orderBookLesson.find.one', id).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }
}
