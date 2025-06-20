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
import { AuthGuard } from 'src/guards/auth.guard';
import { AdminGuard } from 'src/guards/admin.guard';

import { UpdateTetrisUserHistoryDto } from './dto/update-tetris-user-history.dto';
import { UpdateGuessPositionUserHistoryDto } from './dto/update-guess-position-user-history.dto';
import { FindAllPieceSquareLevelsDto } from './dto/find-all-piece-square-levels.dto';
import { CompletePieceSquareLevelDto } from './dto/complete-piece-square-level.dto';
import { RunFileSeedWorldChessChampionDto } from './dto/run-file-seed-world-chess-champion.dto';
import { FindOneWorldChessChampionLevelByUserDto } from './dto/find-one-world-chess-champion-level.dto';
import { FindAllWorldChessChampionLevelsDto } from './dto/find-all-world-chess-champion-levels.dto';
import { CompleteWorldChessChampionLevelDto } from './dto/complete-world-chess-champion-level.dto';

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
  @UseGuards(AdminGuard)
  @Post('/guess-piece-square/generate-32-levels')
  generate32Levels() {
    return this.client.send('pieceSquare.seed.level', {}).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @UseGuards(AuthGuard)
  @Get('/guess-piece-square/:id')
  findOnePieceSquareLevel(
    @Param('id', ParseIntPipe) levelId: number,
    @Req() req: any,
  ) {
    return this.client
      .send('pieceSquare.findOne.level', {
        pieceSquareLevelId: levelId,
        userUid: +req.user.uid,
      })
      .pipe(
        catchError((err) => {
          throw new RpcException(err);
        }),
      );
  }

  @UseGuards(AuthGuard)
  @Get('/guess-piece-square')
  findAllPieceSquareLevels(
    @Query() findAllPieceSquareLevelsDto: FindAllPieceSquareLevelsDto,
    @Req() req: any,
  ) {
    return this.client
      .send('pieceSquare.findAll.level', {
        ...findAllPieceSquareLevelsDto,
        userUid: +req.user.uid,
      })
      .pipe(
        catchError((err) => {
          throw new RpcException(err);
        }),
      );
  }

  @UseGuards(AuthGuard)
  @Patch('/guess-piece-square/complete-level')
  completePieceSquareLevelByUser(
    @Body() completePieceSquareLevelDto: CompletePieceSquareLevelDto,
    @Req() req: any,
  ) {
    const payload = {
      ...completePieceSquareLevelDto,
      userUid: +req.user.uid,
    };

    return this.client.send('pieceSquare.complete.level', payload).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  /* WORLD CHESS CHAMPION GAME */
  @UseGuards(AdminGuard)
  @Post('/world-chess-champion/generate-57-levels')
  generate57Levels() {
    return this.client.send('worldChessChampion.seed.levels', {}).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @UseGuards(AdminGuard)
  @Post('/world-chess-champion/generate-pgn-file-games')
  generateWorldChampionPGNGames(
    @Body() runFileSeedWorldChessChampionDto: RunFileSeedWorldChessChampionDto,
  ) {
    return this.client
      .send('worldChessChampion.seed.games', runFileSeedWorldChessChampionDto)
      .pipe(
        catchError((err) => {
          throw new RpcException(err);
        }),
      );
  }

  @UseGuards(AuthGuard)
  @Get('/world-chess-champion/:id')
  findOneWorldChessChampionGame(
    @Param('id', ParseIntPipe) worldChessChampionLevelId: number,
    @Req() req: any,
  ) {
    const data: FindOneWorldChessChampionLevelByUserDto = {
      worldChessChampionLevelId,
      userUid: +req.user.uid,
    };
    return this.client.send('worldChessChampion.findOne.level', data).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @UseGuards(AuthGuard)
  @Get('/world-chess-champion')
  findAllWorldChessChampionLevels(
    @Query()
    findAllWorldChessChampionLevelsDto: FindAllWorldChessChampionLevelsDto,
    @Req() req: any,
  ) {
    return this.client
      .send('worldChessChampion.findAll.levels', {
        ...findAllWorldChessChampionLevelsDto,
        userUid: +req.user.uid,
      })
      .pipe(
        catchError((err) => {
          throw new RpcException(err);
        }),
      );
  }

  @UseGuards(AuthGuard)
  @Patch('/world-chess-champion/complete-level')
  completeWorldChessChampionLevelByUser(
    @Body()
    completeWorldChessChampionLevelDto: CompleteWorldChessChampionLevelDto,
    @Req() req: any,
  ) {
    const payload = {
      ...completeWorldChessChampionLevelDto,
      userUid: +req.user.uid,
    };

    return this.client.send('worldChessChampion.complete.level', payload).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }
}
