import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { AuthService } from './auth.service';

import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';

@Controller()
export class AuthController {
  
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('auth.register.user')
  create(@Payload() registerAuthDto: RegisterAuthDto) {
    return this.authService.register(registerAuthDto);
  }

  @MessagePattern('auth.login.user')
  login(@Payload() loginAuthDto: LoginAuthDto) {
    return this.authService.login(loginAuthDto);
  }

  @MessagePattern('auth.verify.user')
  verifyToken(@Payload() token: string) {
    return this.authService.verify(token);
  }
  
}
