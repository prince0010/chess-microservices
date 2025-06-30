import {
  Body,
  Controller,
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

import {
  CreateRecordBotUserGameDto,
  UpdateRecordBotUserGameDto,
} from './dto/create-record-bot-user-game.dto';
import { FindAllBotRecordGamesDto } from './dto/find-all-bot-record-games.dto';

@Controller('bot-record-game')
export class BotRecordGameController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @UseGuards(AdminGuard)
  @Post('save-one')
  saveOne(
    @Body() createRecordBotUserGameDto: CreateRecordBotUserGameDto,
    @Req() req: any,
  ) {
    return this.client
      .send('botRecordGame.save.one', {
        ...createRecordBotUserGameDto,
        userUid: +req.user.uid,
      })
      .pipe(
        catchError((err) => {
          throw new RpcException(err);
        }),
      );
  }

  @UseGuards(AuthGuard)
  @Get('/')
  findAll(
    @Query() findAllBotRecordGamesDto: FindAllBotRecordGamesDto,
    @Req() req: any,
  ) {
    const payload = {
      ...findAllBotRecordGamesDto,
      userUid: +req.user.uid,
    };
    return this.client.send('botRecordGame.find.all', payload).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @UseGuards(AuthGuard)
  @Get('/:id')
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.client
      .send('botRecordGame.find.one', { botRecordGameId: id })
      .pipe(
        catchError((err) => {
          throw new RpcException(err);
        }),
      );
  }

  @UseGuards(AdminGuard)
  @Patch('update-one/:id')
  updateOne(
    @Param('id', ParseIntPipe) id: string,
    @Body() updateRecordBotUserGameDto: UpdateRecordBotUserGameDto,
  ) {
    const data = {
      id: +id,
      updateRecordBotUserGameDto,
    };

    return this.client.send('botRecordGame.update.one', data).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }
}
