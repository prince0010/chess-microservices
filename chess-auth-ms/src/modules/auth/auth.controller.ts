import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { AuthService } from './auth.service';

import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { UpdatePointsDto } from './dto/update-points.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
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

  @MessagePattern('update.points.user') // update counter points
  updatePoints(@Payload() updatePointsDto: UpdatePointsDto) {
    return this.authService.updatePoints(updatePointsDto);
  }

  @MessagePattern('subtract.points.user') // reduce counter points
  reducePoints(@Payload() updatePointsDto: UpdatePointsDto) {
    return this.authService.subtractPoints(updatePointsDto);
  }

  @MessagePattern('auth.find.usersByUids')
  findUsersByUidArray(@Payload() iUserUidsArray: IUserUidsArray) {
    return this.authService.findUsersByUids(iUserUidsArray.uids);
  }
}
