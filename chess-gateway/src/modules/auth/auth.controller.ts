import {
  Body,
  Controller,
  Get,
  Inject,
  InternalServerErrorException,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';

import { AuthGuard } from 'src/guards/auth.guard';
import { TeacherGuard } from 'src/guards/teacher.guard';
import { NATS_SERVICE } from 'src/config';
import { Token, User } from './decorators';

import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { FindAllUsersDto } from './dto/find-all-users.dto';
import { ICurrentUser } from './interfaces/user.interface';

@Controller('auth')
export class AuthController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @Post('register')
  registerUser(@Body() registerAuthDto: RegisterAuthDto) {
    return this.client.send('auth.register.user', registerAuthDto).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @UseGuards(AuthGuard)
  @Post('update-profile')
  updateUser(@Body() updateAuthDto: UpdateAuthDto, @Req() req: any) {
    const data = {
      ...updateAuthDto,
      userUid: +req.user.uid,
    };
    return this.client.send('auth.update.user', data).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @Post('login')
  loginUser(@Body() loginAuthDto: LoginAuthDto) {
    return this.client.send('auth.login.user', loginAuthDto).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @UseGuards(AuthGuard)
  @Get('list-stories')
  getListUnlockedStories(@User() user: ICurrentUser) {
    return this.client.send('auth.findAll.stories', user.uid).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @UseGuards(AuthGuard)
  @Get('verify')
  verifyToken(@User() user: ICurrentUser, @Token() token: string) {
    return { user, token };
  }

  @Get('logout')
  @UseGuards(AuthGuard)
  logout(@User() user: ICurrentUser) {
    return user
      ? { ok: true }
      : new InternalServerErrorException(
          'It is not allowed to close session if user is not previously authenticated, review --logs-- Admin',
        );
  }

  @UseGuards(TeacherGuard)
  @Get('/')
  findAllUsers(
    @Query() findAllUsersDto: FindAllUsersDto,
    @User() user: ICurrentUser,
  ) {
    const payload = {
      ...findAllUsersDto,
      user,
    };
    return this.client.send('auth.findAll.users', payload).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @UseGuards(AuthGuard)
  @Get('/:id')
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.client.send('auth.findone.user', id).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }
}
