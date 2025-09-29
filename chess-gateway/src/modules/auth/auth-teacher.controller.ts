import * as fs from 'fs';
import * as path from 'path';
import { Response } from 'express';
import {
  Body,
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { catchError } from 'rxjs';

import { AdminGuard } from 'src/guards/admin.guard';
import { TeacherGuard } from 'src/guards/teacher.guard';
import { NATS_SERVICE } from 'src/config';
import { cleanupFiles, generateName, myFileFilter } from 'src/common/files';

import { RegisterAuthTeacherDto } from './dto/register-auth-teacher.dto';
import { FindAllTeachersDto } from './dto/find-all-teachers.dto';
import { UpdateAuthTeacherDto } from './dto/update-auth-teacher.dto';
import { AddStudentsToTeacherDto } from './dto/add-students-to-teacher.dto';
import {
  RequestJoinTeacherDto,
  UpdateApplicationStatusDto,
} from './dto/request-join-teacher.dto';
import { RequestJoinFindAllDto } from './dto/request-join-find-all.dto';

@Controller('auth-teacher')
export class AuthTeacherController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @UseGuards(AdminGuard)
  @Post('register')
  registerTeacher(@Body() registerAuthTeacherDto: RegisterAuthTeacherDto) {
    return this.client
      .send('auth.register.teacher', registerAuthTeacherDto)
      .pipe(
        catchError((err) => {
          throw new RpcException(err);
        }),
      );
  }

  // public endpoint
  @Post('request-join')
  @UseInterceptors(
    FilesInterceptor('files', 6, {
      fileFilter: myFileFilter,
      storage: diskStorage({
        destination: '/usr/src/app/uploads',
        filename: generateName,
      }),
    }),
  )
  requestApplication(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() requestJoinTeacherDto: RequestJoinTeacherDto,
  ) {
    const pathFiles: string[] = files.map((file) => {
      return file.path;
    });

    const payload = {
      ...requestJoinTeacherDto,
      files: pathFiles || [],
    };

    return this.client.send('auth.requestJoin.teacher', payload).pipe(
      catchError((err) => {
        cleanupFiles(files);
        throw new RpcException(err);
      }),
    );
  }

  @UseGuards(AdminGuard)
  @Patch('update-application')
  updateApplication(
    @Body() updateApplicationStatusDto: UpdateApplicationStatusDto,
  ) {
    return this.client
      .send('auth.updateApplication.teacher', updateApplicationStatusDto)
      .pipe(
        catchError((err) => {
          throw new RpcException(err);
        }),
      );
  }

  @UseGuards(AdminGuard)
  @Get('/all-requests-to-join')
  findAllRequests(@Query() requestJoinFindAllDto: RequestJoinFindAllDto) {
    return this.client
      .send('auth.findAll.requestJoin', requestJoinFindAllDto)
      .pipe(
        catchError((err) => {
          throw new RpcException(err);
        }),
      );
  }

  @UseGuards(AdminGuard)
  @Get('/request/:id')
  findOneRequest(@Param('id', ParseIntPipe) requestId: number) {
    return this.client.send('auth.findOne.requestJoin', requestId).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @UseGuards(AdminGuard)
  @Get('/files/:filename')
  async downloadFile(
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    try {
      const filePath = path.join('/usr/src/app/uploads', filename);

      if (!fs.existsSync(filePath)) {
        throw new NotFoundException('File not found');
      }

      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${filename}"`,
      );

      // Determine content type based on file extension
      const ext = path.extname(filename).toLowerCase();
      const mimeTypes = {
        '.pdf': 'application/pdf',
        '.doc': 'application/msword',
        '.docx':
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        '.txt': 'text/plain',
      };

      const contentType = mimeTypes[ext] || 'application/octet-stream';
      res.setHeader('Content-Type', contentType);

      // Stream the file to the response
      const fileStream = fs.createReadStream(filePath);

      fileStream.on('error', (error) => {
        throw new NotFoundException('Error reading file');
      });

      fileStream.pipe(res);
    } catch (error) {
      throw new NotFoundException('File not found or unable to download');
    }
  }

  @UseGuards(AdminGuard)
  @Get('/')
  findAllTeachers(@Query() findAllTeachersDto: FindAllTeachersDto) {
    return this.client.send('auth.findAll.teachers', findAllTeachersDto).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @UseGuards(TeacherGuard)
  @Get('/:id')
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.client.send('auth.findOne.teacher', id).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @UseGuards(TeacherGuard)
  @Patch('update-profile')
  updateTeacher(
    @Body() updateAuthTeacherDto: UpdateAuthTeacherDto,
    @Req() req: any,
  ) {
    const data = {
      ...updateAuthTeacherDto,
      teacherUid: +req.user.uid,
    };
    return this.client.send('auth.update.teacher', data).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @UseGuards(TeacherGuard)
  @Patch('add-students')
  addStudents(
    @Body() addStudentsToTeacherDto: AddStudentsToTeacherDto,
    @Req() req: any,
  ) {
    const data = {
      ...addStudentsToTeacherDto,
      teacherUid: +req.user.uid,
    };
    return this.client.send('auth.addStudents.teacher', data).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }
}
