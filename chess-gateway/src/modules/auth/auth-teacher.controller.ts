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
