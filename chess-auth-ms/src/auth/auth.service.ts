import { BadRequestException, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcryptjs from 'bcryptjs';
import { Repository } from 'typeorm';

import { envs } from '../config/envs';
import { Auth } from './entities/auth.entity';

import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,

    private readonly jwtService: JwtService, // default Nest Service to generate JWT
  ) {}

  async verify(token: string) {
    try {
      const { sub, iat, exp, ...user } = this.jwtService.verify(token, {
        secret: envs.jwtSecret,
      });

      return {
        user,
        token: await this.singJWT(user),
      };
    } catch (error) {
      throw new RpcException({
        status: 401,
        message: 'Invalid token',
      });
    }
  }

  async register(registerAuthDto: RegisterAuthDto): Promise<any> {
    const { password, username, roles, ...restUser } = registerAuthDto;

    try {
      const existsUsername = await this.authRepository.findOneBy({ username });

      if (existsUsername) {
        throw new BadRequestException(
          `Someone with the username: ${existsUsername.username} already exists.`,
        );
      }

      const newUser = this.authRepository.create({
        username,
        password: bcryptjs.hashSync(password, 10),
        roles,
      });

      const savedUser = await this.authRepository.save(newUser);

      return {
        user: restUser,
        token: await this.singJWT(savedUser),
      };
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  async login(loginAuthDto: LoginAuthDto) {
    const { username, password } = loginAuthDto;
    try {
      const user = await this.authRepository.findOneBy({ username });

      if (!user) {
        throw new RpcException({
          status: 400,
          message: 'User does not exists',
        });
      }

      const isValidPassword = bcryptjs.compareSync(password, user.password);

      if (!isValidPassword) {
        throw new RpcException({
          status: 400,
          message: 'Invalid credentials',
        });
      }

      const { password: __, ...restUser } = user;

      return {
        user: restUser,
        token: await this.singJWT(user),
      };
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  // ==== private methods ====
  private getJwtPayload(user: Auth): JwtPayload {
    return {
      uid: user.uid,
      name: user.name,
      username: user.username,
    };
  }

  private async singJWT(user: Auth) {
    return this.jwtService.sign(this.getJwtPayload(user));
  }
}
