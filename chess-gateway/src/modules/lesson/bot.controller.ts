import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
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

import { CreateBotDto, UpdateBotDto } from './dto/create-bot.dto';
import { FindAllBotsDto } from './dto/find-all-bots.dto';

@Controller('bot')
export class BotController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @UseGuards(AdminGuard)
  @Post('create-one')
  createOne(@Body() createBotDto: CreateBotDto) {
    return this.client.send('bot.create.one', createBotDto).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @UseGuards(AuthGuard)
  @Get('/')
  findAll(@Query() findAllBotsDto: FindAllBotsDto) {
    return this.client.send('bot.find.all', findAllBotsDto).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @UseGuards(AuthGuard)
  @Get('/:id')
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.client.send('bot.find.one', +id).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @UseGuards(AdminGuard)
  @Patch('update-one/:id')
  updateOne(
    @Param('id', ParseIntPipe) id: string,
    @Body() updateBotDto: UpdateBotDto,
  ) {
    const data = {
      id: +id,
      updateBotDto,
    };

    return this.client.send('bot.update.one', data).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @UseGuards(AdminGuard)
  @Delete('/:id')
  deleteOne(@Param('id', ParseIntPipe) id: string) {
    return this.client.send('bot.remove.one', +id).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }
}
