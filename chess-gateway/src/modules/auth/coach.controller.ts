import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { catchError, firstValueFrom } from 'rxjs';

import { NATS_SERVICE } from 'src/config';
import { AdminGuard } from 'src/guards/admin.guard';
import { cleanupFiles, generateName, myFileFilter } from 'src/common/files';
import { CoachCloudinaryService } from './coach-cloudinary.service';

import { CreateCoachDto, UpdateCoachDto } from './dto/create-coach.dto';
import { FindAllCoachesDto } from './dto/find-all-coaches.dto';

@Controller('coach')
export class CoachController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
    private readonly coachCloudinaryService: CoachCloudinaryService,
  ) {}

  @Post('create-one')
  @UseGuards(AdminGuard)
  @UseInterceptors(
    FilesInterceptor('files', undefined, {
      fileFilter: myFileFilter,
      storage: diskStorage({
        destination: '/usr/src/app/uploads',
        filename: generateName,
      }),
    }),
  )
  async createNewCoach(
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

    // store on cloudinary the photo coach and their CV
    const secureCloudinaryUrls =
      await this.coachCloudinaryService.storeFilesInCloudinary(pathFiles);

    const validImgExtensions = ['jpeg', 'jpg', 'png', 'webp'];
    let photoUrl = '';
    let cvUrl = '';
    for (const url of secureCloudinaryUrls) {
      validImgExtensions.some((extension) => url.includes(extension))
        ? (photoUrl = url)
        : (cvUrl = url);
    }
    const payload = {
      ...createCoachDto,
      photoUrl,
      cvUrl,
    };

    // cleanup temporary files from fs
    cleanupFiles(files);

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

  @Patch('/update-one/:id')
  @UseGuards(AdminGuard)
  @UseInterceptors(
    FilesInterceptor('files', undefined, {
      fileFilter: myFileFilter,
      storage: diskStorage({
        destination: '/usr/src/app/uploads',
        filename: generateName,
      }),
    }),
  )
  async update(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Param('id', ParseIntPipe) coachId: number,
    @Body() updateCoachDto: UpdateCoachDto,
  ) {
    if (files && files.length && files.length !== 2) {
      cleanupFiles(files);
      throw new BadRequestException(
        `If you want update coach files, upload two files exactly, a photo and their CV.`,
      );
    }

    const pathFiles = files.map((file) => {
      return file.path;
    });

    const payload: any = {
      id: coachId,
      ...updateCoachDto,
    };

    if (pathFiles.length) {
      // retrieve old coach
      const oldCoach = await firstValueFrom(
        this.client.send('coach.find.one', coachId),
      ).catch((err) => {
        throw new RpcException(err);
      });

      const oldUrlFiles = [oldCoach.photoUrl, oldCoach.cvUrl];

      const secureCloudinaryUrls =
        await this.coachCloudinaryService.updateFilesInCloudinary(
          oldUrlFiles,
          pathFiles,
        );

      const validImgExtensions = ['jpeg', 'jpg', 'png', 'webp'];
      let photoUrl = '';
      let cvUrl = '';
      for (const url of secureCloudinaryUrls) {
        validImgExtensions.some((extension) => url.includes(extension))
          ? (photoUrl = url)
          : (cvUrl = url);
      }

      payload.photoUrl = photoUrl;
      payload.cvUrl = cvUrl;

      // cleanup temporary files from fs
      cleanupFiles(files);
    }

    return this.client.send('coach.update.one', payload).pipe(
      catchError((err) => {
        cleanupFiles(files);
        throw new RpcException(err);
      }),
    );
  }

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
