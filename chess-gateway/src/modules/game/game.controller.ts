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
import { UpdateGuessPositionUserHistoryDto } from './dto/update-guess-position-user-history.dto';
import { UpdatePieceSquareUserHistoryDto } from './dto/update-piece-square-user-history.dto';

@Controller('game')
export class GameController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  /* TETRIS */
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
  @Get('/tetris/ranking')
  getTetrisRanking(@Req() req: any) {
    return this.client.send('tetris.find.ranking', +req.user.uid).pipe(
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

  /* GUESS POSITION */
  @UseGuards(AuthGuard)
  @Get('/guess-position/score-by-user')
  findOneGuessPositionScoreByUser(@Req() req: any) {
    return this.client
      .send('guessPosition.find.scoreByUser', +req.user.uid)
      .pipe(
        catchError((err) => {
          throw new RpcException(err);
        }),
      );
  }

  @UseGuards(AuthGuard)
  @Get('/guess-position/ranking')
  getGuessPositionRanking(@Req() req: any) {
    return this.client.send('guessPosition.find.ranking', +req.user.uid).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @UseGuards(AuthGuard)
  @Patch('/guess-position/update-score-by-user')
  updateGuessPositionScoreByUser(
    @Body()
    updateGuessPositionUserHistoryDto: UpdateGuessPositionUserHistoryDto,
    @Req() req: any,
  ) {
    const payload = {
      ...updateGuessPositionUserHistoryDto,
      userUid: +req.user.uid,
    };

    return this.client.send('guessPosition.update.scoreByUser', payload).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  /* GUESS PIECE SQUARE */
  @UseGuards(AuthGuard)
  @Get('/guess-piece-square/score-by-user')
  findOnePieceSquareScoreByUser(@Req() req: any) {
    return this.client.send('pieceSquare.find.scoreByUser', +req.user.uid).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @UseGuards(AuthGuard)
  @Get('/guess-piece-square/ranking')
  getPieceSquareRanking(@Req() req: any) {
    return this.client.send('pieceSquare.find.ranking', +req.user.uid).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @UseGuards(AuthGuard)
  @Patch('/guess-piece-square/update-score-by-user')
  updatePieceSquareScoreByUser(
    @Body() updatePieceSquareUserHistoryDto: UpdatePieceSquareUserHistoryDto,
    @Req() req: any,
  ) {
    const payload = {
      ...updatePieceSquareUserHistoryDto,
      userUid: +req.user.uid,
    };

    return this.client.send('pieceSquare.update.scoreByUser', payload).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }
}
