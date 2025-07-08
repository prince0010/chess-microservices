import {
  Controller,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';

import { NATS_SERVICE } from 'src/config';
import { AuthGuard } from 'src/guards/auth.guard';
import { FindAllHistoryRecordLessonTestDto } from './dto/find-all-history-record-lesson-test.dto';

@Controller('lesson-parent-test-record')
export class LessonParentTestRecordController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @UseGuards(AuthGuard)
  @Get('/')
  findAll(
    @Query()
    findAllHistoryRecordLessonTestDto: FindAllHistoryRecordLessonTestDto,
    @Req() req: any,
  ) {
    const payload = {
      ...findAllHistoryRecordLessonTestDto,
      userUid: +req.user.uid,
    };

    return this.client
      .send('lessonParent.testRecord.findAllByUser', payload)
      .pipe(
        catchError((err) => {
          throw new RpcException(err);
        }),
      );
  }

  @UseGuards(AuthGuard)
  @Get('/:recordId')
  findOne(@Param('recordId', ParseIntPipe) recordId: number, @Req() req: any) {
    const payload = {
      recordId,
      userUid: +req.user.uid,
    };

    return this.client
      .send('lessonParent.testRecord.findOneByUser', payload)
      .pipe(
        catchError((err) => {
          throw new RpcException(err);
        }),
      );
  }
}
