import {
  Body,
  Controller,
  Get,
  Inject,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';

import { NATS_SERVICE } from 'src/config';
import { AuthGuard } from 'src/guards/auth.guard';

import { UpdateTetrisUserHistoryDto } from './dto/update-tetris-user-history.dto';

@Controller('game')
export class GameController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @UseGuards(AuthGuard)
  @Get('/tetris/score-by-user')
  findOneTetrisScoreByUser(@Req() req: any) {
    return this.client.send('tetris.find.scoreByUser', +req.user.uid).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @UseGuards(AuthGuard)
  @Patch('/tetris/update-score-by-user')
  updateTetrisScoreByUser(
    @Body() updateTetrisUserHistoryDto: UpdateTetrisUserHistoryDto,
    @Req() req: any,
  ) {
    const payload = {
      ...updateTetrisUserHistoryDto,
      userUid: +req.user.uid,
    };

    return this.client.send('tetris.update.scoreByUser', payload).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }
}
