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
import { SuperAdminGuard } from 'src/guards/super-admin.guard';

import { FindAllLessonParentDto } from './dto/find-all-lesson-parent.dto';
import { CompleteLessonParentDto } from './dto/complete-lesson-parent.dto';
import { FindOneLessonParentDto } from './dto/find-one-lesson-parent.dto';

@Controller('lesson-parent')
export class LessonParentController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @UseGuards(SuperAdminGuard)
  @Post('seed-data')
  seedDataLessonParents() {
    return this.client.send('lessonParent.seed.data', {}).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @UseGuards(SuperAdminGuard)
  @Post('')
  createOne() {
    return 'This endpoint is not available at the moment. Seed of lessonParent was created to avoid this.';
    // return this.client
    //   .send('lessonParent.create.one', createLessonParentDto)
    //   .pipe(
    //     catchError((err) => {
    //       throw new RpcException(err);
    //     }),
    //   );
  }

  @UseGuards(AuthGuard)
  @Get('/')
  findAll(
    @Query() findAllLessonParentDto: FindAllLessonParentDto,
    @Req() req: any,
  ) {
    const payload = { ...findAllLessonParentDto, userUid: req.user.uid };

    return this.client.send('lessonParent.find.all', payload).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @UseGuards(AuthGuard)
  @Get('/:id')
  findOne(@Param('id', ParseIntPipe) lessonParentId: string, @Req() req: any) {
    const payload: FindOneLessonParentDto = {
      lessonParentId: +lessonParentId,
      userUid: req.user.uid,
    };

    return this.client.send('lessonParent.find.one', payload).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @UseGuards(AuthGuard)
  @Patch('update-completed')
  completeOne(
    @Body() completeLessonParentDto: CompleteLessonParentDto,
    @Req() req: any,
  ) {
    const payload = { ...completeLessonParentDto, userUid: req.user.uid };

    return this.client
      .send('lessonParent.update.lessonsCompleted', payload)
      .pipe(
        catchError((err) => {
          throw new RpcException(err);
        }),
      );
  }
}
