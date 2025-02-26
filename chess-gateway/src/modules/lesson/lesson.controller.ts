import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';

import { NATS_SERVICE } from 'src/config';
import { SuperAdminGuard } from 'src/guards/super-admin.guard';

import { InsertLessonDto } from './dto/insert-lesson.dto';

@Controller('lesson')
export class LessonController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @UseGuards(SuperAdminGuard)
  @Post('seed')
  registerUser(@Body() insertLessonDto: InsertLessonDto) {
    return this.client.send('lesson.insert.pgn', insertLessonDto).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }
}
