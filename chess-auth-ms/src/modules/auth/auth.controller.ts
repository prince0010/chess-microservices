import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { AuthService } from './auth.service';

import {
  RegisterAuthDto,
  LoginAuthDto,
  UpdateUserPointsDto,
  UpdateAuthDto,
  FindAllUsersDto,
} from './dto';
import { UpdatePandaUserPointsDto } from '../panda/dto/update-panda-user-points.dto';
import { IUserUidsArray } from './interfaces';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('auth.register.user')
  create(@Payload() registerAuthDto: RegisterAuthDto) {
    return this.authService.register(registerAuthDto);
  }

  @MessagePattern('auth.update.user')
  update(@Payload() updateAuthDto: UpdateAuthDto) {
    return this.authService.updateProfile(updateAuthDto);
  }

  @MessagePattern('auth.login.user')
  login(@Payload() loginAuthDto: LoginAuthDto) {
    return this.authService.login(loginAuthDto);
  }

  @MessagePattern('auth.verify.user')
  verifyToken(@Payload() token: string) {
    return this.authService.verify(token);
  }

  @MessagePattern('auth.findone.user')
  findOne(@Payload() uid: string | number) {
    return this.authService.findOne(+uid);
  }

  @MessagePattern('auth.findAll.users')
  findAllPlayers(@Payload() findAllUsersDto: FindAllUsersDto) {
    return this.authService.findAllUsers(findAllUsersDto);
  }

  @MessagePattern('update.points.user') // update counter points
  updatePoints(@Payload() updateUserPointsDto: UpdateUserPointsDto) {
    return this.authService.updatePoints(updateUserPointsDto);
  }

  @MessagePattern('subtract.points.user') // reduce counter points
  reducePoints(@Payload() updatePandaUserPointsDto: UpdatePandaUserPointsDto) {
    return this.authService.subtractPoints(updatePandaUserPointsDto);
  }

  @MessagePattern('auth.find.usersByUids')
  findUsersByUidArray(@Payload() iUserUidsArray: IUserUidsArray) {
    return this.authService.findUsersByUids(iUserUidsArray.uids);
  }
}
