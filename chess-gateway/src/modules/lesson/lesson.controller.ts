import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';

import { NATS_SERVICE } from 'src/config';
import { AuthGuard } from 'src/guards/auth.guard';
import { SuperAdminGuard } from 'src/guards/super-admin.guard';

import { InsertLessonDto } from './dto/insert-lesson.dto';

@Controller('lesson')
export class LessonController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @UseGuards(SuperAdminGuard)
  @Post('seed')
  insertLessonsByPgnFile(@Body() insertLessonDto: InsertLessonDto) {
    return this.client.send('lesson.insert.pgn', insertLessonDto).pipe(
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
