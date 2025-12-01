import * as fs from 'fs';
import * as path from 'path';
import { Response } from 'express';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { catchError } from 'rxjs';

import { NATS_SERVICE } from 'src/config';
import { AdminGuard } from 'src/guards/admin.guard';
import { cleanupFiles, generateName, myFileFilter } from 'src/common/files';

import { CreateCoachDto } from './dto/create-coach.dto';
import { FindAllCoachesDto } from './dto/find-all-coaches.dto';

@Controller('coach')
export class CoachController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @Post('create-one')
  @UseGuards(AdminGuard)
  @UseInterceptors(
    FilesInterceptor('files', 6, {
      fileFilter: myFileFilter,
      storage: diskStorage({
        destination: '/usr/src/app/uploads',
        filename: generateName,
      }),
    }),
  )
  createNewCoach(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() createCoachDto: CreateCoachDto,
  ) {
    if (!files) {
      throw new BadRequestException(
        `Files is empty. Upload coach photo and CV.`,
      );
    } else if (files.length !== 2) {
      cleanupFiles(files);
      throw new BadRequestException(
        `Upload two files exactly, a photo and the CV.`,
      );
    }

    const pathFiles: string[] = files.map((file) => {
      return file.path;
    });

    const validImgExtensions = ['jpeg', 'jpg', 'png', 'webp'];
    let photoUrl = '';
    let cvUrl = '';
    for (const file of pathFiles) {
      validImgExtensions.some((extension) => file.includes(extension))
        ? (photoUrl = file)
        : (cvUrl = file);
    }

    const payload = {
      ...createCoachDto,
      photoUrl,
      cvUrl,
    };

    return this.client.send('coach.create.one', payload).pipe(
      catchError((err) => {
        cleanupFiles(files);
        throw new RpcException(err);
      }),
    );
  }

  // admin and public endpoint
  @Get('/')
  findAllCoaches(@Query() dto: FindAllCoachesDto) {
    return this.client.send('coach.find.all', dto).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  // admin and public endpoint
  @Get('/:id')
  findOneCoach(@Param('id', ParseIntPipe) id: number) {
    return this.client.send('coach.find.one', id).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  // TODO: implement update endpoint

  @Delete('/:id')
  @UseGuards(AdminGuard)
  deleteOneCoach(@Param('id', ParseIntPipe) id: number) {
    return this.client.send('coach.remove.one', id).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }
}
