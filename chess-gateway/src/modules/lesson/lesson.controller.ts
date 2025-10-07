import {
  Controller,
  Get,
  Inject,
  Param,
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
import { SuperAdminGuard } from 'src/guards/super-admin.guard';
import { TeacherGuard } from 'src/guards/teacher.guard';

import { FindAllHistoryRecordLessonDto } from './dto/find-all-history-record-lesson.dto';

@Controller('lesson')
export class LessonController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @UseGuards(SuperAdminGuard)
  @Post('seed-all-pgn-files')
  insertLessonsByPgnFile() {
    return this.client.send('lesson.insert.pgn', {}).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @UseGuards(SuperAdminGuard)
  @Post('seed-all-advanced-pgn-files')
  insertAdvancedPgnFiles() {
    return this.client.send('lesson.insert.advancedPgn', {}).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @UseGuards(AuthGuard)
  @Get('get-record')
  getRecord(
    @Query() findAllHistoryRecordLessonDto: FindAllHistoryRecordLessonDto,
    @Req() req: any,
  ) {
    const payload = { ...findAllHistoryRecordLessonDto, userUid: req.user.uid };
    return this.client.send('lesson.find.historyRecord', payload).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  // TOP 100
  @UseGuards(AuthGuard)
  @Get('top-one-hundred-by-education')
  topOneHundredByEducation(@Req() req: any) {
    return this.client
      .send('auth.ranking.educationLessons', +req.user.uid)
      .pipe(
        catchError((err) => {
          throw new RpcException(err);
        }),
      );
  }

  @UseGuards(AuthGuard)
  @Get('top-one-hundred-by-puzzle')
  topOneHundredByPuzzle(@Req() req: any) {
    return this.client.send('auth.ranking.puzzleLessons', +req.user.uid).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @UseGuards(AuthGuard)
  @Get('top-one-hundred-by-endgames')
  topOneHundredByEndgames(@Req() req: any) {
    return this.client.send('auth.ranking.endgamesLessons', +req.user.uid).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }
  // END TOP 100

  @UseGuards(TeacherGuard)
  @Get('/get-advanced-lesson/:id')
  findOneAdvanced(@Param('id', ParseIntPipe) advancedLessonId: number) {
    return this.client.send('lesson.advanced.findOne', advancedLessonId).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @UseGuards(AuthGuard)
  @Get('/:id')
  findOne(@Param('id', ParseIntPipe) id: string, @Req() req: any) {
    const payload = { lessonId: id, userUid: req.user.uid };
    return this.client.send('lesson.find.one', payload).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }
}
