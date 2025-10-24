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
import { catchError, firstValueFrom } from 'rxjs';

import { NATS_SERVICE } from 'src/config';
import { AuthGuard } from 'src/guards/auth.guard';
import { SuperAdminGuard } from 'src/guards/super-admin.guard';
import { TeacherGuard } from 'src/guards/teacher.guard';
import { RedisService } from '../redis/redis.service';

import { FindAllHistoryRecordLessonDto } from './dto/find-all-history-record-lesson.dto';
import { FindAllLessonAdvancedDto } from './dto/find-all-lesson-advanced.dto';

@Controller('lesson')
export class LessonController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
    private readonly redisService: RedisService,
  ) {}

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
  async topOneHundredByEducation(@Req() req: any) {
    const cacheKey = `top-one-hundred-by-education-${req.user.uid}`;
    const cached = await this.redisService.get(cacheKey);

    if (cached) {
      return cached;
    }

    const result = await firstValueFrom(
      this.client.send('auth.ranking.educationLessons', +req.user.uid).pipe(
        catchError((err) => {
          throw new RpcException(err);
        }),
      ),
    );

    await this.redisService.set(cacheKey, result, 60); // one minute of TTL

    return result;
  }

  @UseGuards(AuthGuard)
  @Get('top-one-hundred-by-puzzle')
  async topOneHundredByPuzzle(@Req() req: any) {
    const cacheKey = `top-one-hundred-by-puzzle-${req.user.uid}`;
    const cached = await this.redisService.get(cacheKey);

    if (cached) {
      return cached;
    }

    const result = await firstValueFrom(
      this.client.send('auth.ranking.puzzleLessons', +req.user.uid).pipe(
        catchError((err) => {
          throw new RpcException(err);
        }),
      ),
    );

    await this.redisService.set(cacheKey, result, 60); // one minute of TTL

    return result;
  }

  @UseGuards(AuthGuard)
  @Get('top-one-hundred-by-endgames')
  async topOneHundredByEndgames(@Req() req: any) {
    const cacheKey = `top-one-hundred-by-endgames-${req.user.uid}`;
    const cached = await this.redisService.get(cacheKey);

    if (cached) {
      return cached;
    }

    const result = await firstValueFrom(
      this.client.send('auth.ranking.endgamesLessons', +req.user.uid).pipe(
        catchError((err) => {
          throw new RpcException(err);
        }),
      ),
    );

    await this.redisService.set(cacheKey, result, 60); // one minute of TTL

    return result;
  }
  // END TOP 100

  @UseGuards(TeacherGuard)
  @Get('/get-advanced-lesson/:id')
  async findOneAdvanced(@Param('id', ParseIntPipe) advancedLessonId: number) {
    const cacheKey = `get-advanced-lesson-${advancedLessonId}`;
    const cached = await this.redisService.get(cacheKey);

    // changeMe! in production
    // if (cached) {
    //   return cached;
    // }

    const result = await firstValueFrom(
      this.client.send('lesson.advanced.findOne', advancedLessonId).pipe(
        catchError((err) => {
          throw new RpcException(err);
        }),
      ),
    );

    await this.redisService.set(cacheKey, result, 30000); // large TTL

    return result;
  }

  @UseGuards(TeacherGuard)
  @Get('/get-list-advanced-lessons')
  async getListAdvancedLessons(
    @Query() findAllLessonAdvancedDto: FindAllLessonAdvancedDto,
  ) {
    const { page } = findAllLessonAdvancedDto;
    const cacheKey = `get-list-advanced-lessons-${page}`;
    const cached = await this.redisService.get(cacheKey);

    // changeMe! in production
    // if (cached) {
    //   return cached;
    // }

    const result = await firstValueFrom(
      this.client
        .send('lesson.advanced.findAll', findAllLessonAdvancedDto)
        .pipe(
          catchError((err) => {
            throw new RpcException(err);
          }),
        ),
    );

    await this.redisService.set(cacheKey, result, 30000); // large TTL

    return result;
  }

  @UseGuards(AuthGuard)
  @Get('/:id')
  async findOne(@Param('id', ParseIntPipe) id: string, @Req() req: any) {
    const cacheKey = `single-lesson-by-id-user-${id}-${req.user.uid}`;
    const cached = await this.redisService.get(cacheKey);

    if (cached) {
      return cached;
    }

    const payload = { lessonId: id, userUid: req.user.uid };

    const result = await firstValueFrom(
      this.client.send('lesson.find.one', payload).pipe(
        catchError((err) => {
          throw new RpcException(err);
        }),
      ),
    );

    await this.redisService.set(cacheKey, result, 120);

    return result;
  }
}
