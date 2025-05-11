import {
  Body,
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
import { SuperAdminGuard } from 'src/guards/super-admin.guard';

import { CreateLessonParentDto } from './dto/create-lesson-parent.dto';

@Controller('lesson-parent')
export class LessonParentController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @UseGuards(SuperAdminGuard)
  @Post('')
  createOne(@Body() createLessonParentDto: CreateLessonParentDto) {
    return this.client
      .send('lessonParent.create.one', createLessonParentDto)
      .pipe(
        catchError((err) => {
          throw new RpcException(err);
        }),
      );
  }
}
