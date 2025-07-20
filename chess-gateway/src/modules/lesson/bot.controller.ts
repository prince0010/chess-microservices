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
import { SuperAdminGuard } from 'src/guards/super-admin.guard';

import { CreateBotDto, UpdateBotDto } from './dto/create-bot.dto';
import { CounterBotUserHistoryDto } from './dto/counter-bot-user-history.dto';
import { FindAllBotsDto } from './dto/find-all-bots.dto';

@Controller('bot')
export class BotController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @UseGuards(SuperAdminGuard)
  @Post('seed-animal-bots')
  seedAnimalBots() {
    return this.client.send('bot.seed.animals', {}).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @UseGuards(AdminGuard)
  @Post('create-one')
  createOne(@Body() createBotDto: CreateBotDto) {
    return this.client.send('bot.create.one', createBotDto).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  // TOP 100
  @UseGuards(AuthGuard)
  @Get('top-one-hundred-by-animal-bots')
  topOneHundredByAnimalBots(@Req() req: any) {
    return this.client.send('auth.ranking.animalBots', +req.user.uid).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @UseGuards(AuthGuard)
  @Get('/')
  findAll(@Query() findAllBotsDto: FindAllBotsDto, @Req() req: any) {
    const payload = {
      ...findAllBotsDto,
      userUid: +req.user.uid,
    };
    return this.client.send('bot.find.all', payload).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @UseGuards(AuthGuard)
  @Get('/:id')
  findOne(@Param('id', ParseIntPipe) id: string, @Req() req: any) {
    const payload = {
      botId: +id,
      userUid: +req.user.uid,
    };
    return this.client.send('bot.find.one', payload).pipe(
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

  @UseGuards(AuthGuard)
  @Patch('update-counter-by-user/:botId')
  updateCounterByUser(
    @Param('botId', ParseIntPipe) botId: string,
    @Req() req: any,
    @Body() counterBotUserHistoryDto: CounterBotUserHistoryDto,
  ) {
    const data = {
      userUid: +req.user.uid,
      botId: +botId,
      ...counterBotUserHistoryDto,
    };

    return this.client.send('bot.user.updateHistory', data).pipe(
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
