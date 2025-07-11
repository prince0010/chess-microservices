import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, In, Like, Repository } from 'typeorm';
import { firstValueFrom } from 'rxjs';
import * as bcryptjs from 'bcryptjs';

import { envs, NATS_SERVICE } from 'src/config';
import { Auth } from './entities/auth.entity';
import { AuthPanda } from 'src/modules/panda/entities/auth-panda.entity';

import { RegisterAuthDto } from './dto/register-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { UpdatePointsDto } from './dto/update-points.dto';
import { FindAllUsersDto } from './dto/find-all-users.dto';
import { SecurityRoles } from 'src/enum';
import {
  JwtPayload,
  IOneUser,
  IUpdatedPointsUser,
  ISubtractPointsUser,
  ICountAndListUsers,
} from './interfaces';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,

    @InjectRepository(AuthPanda)
    private readonly authPandaRepository: Repository<AuthPanda>,

    private readonly jwtService: JwtService, // default Nest Service to generate JWT
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
  ) {}

  async register(registerAuthDto: RegisterAuthDto): Promise<any> {
    const { password, username, ...restUser } = registerAuthDto;

    try {
      const existsUsername = await this.authRepository.findOneBy({
        username: username.toLowerCase(),
      });

      if (existsUsername) {
        throw new BadRequestException(
          `Someone with the username: ${existsUsername.username} already exists.`,
        );
      }

      const newUser = this.authRepository.create({
        username: username.toLowerCase(),
        password: bcryptjs.hashSync(password, 10),
        ...restUser,
      });

      const savedUser = await this.authRepository.save(newUser);

      // STEP create panda user only the first time
      const newPanda = this.authPandaRepository.create({
        user: savedUser,
      });

      await this.authPandaRepository.save(newPanda);

      const userWithPanda = await this.authRepository.findOne({
        where: { uid: savedUser.uid },
        relations: ['panda'],
      });

      const { password: leavePassword, ...restFrontendUser } = userWithPanda!;

      return {
        user: restFrontendUser,
        token: await this.singJWT(savedUser),
      };
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  async updateProfile(updateAuthDto: UpdateAuthDto): Promise<any> {
    const {
      userUid,
      name = null,
      password: newPassword = null,
      username = null,
    } = updateAuthDto;

    try {
      const oldUser = await this.authRepository.findOneBy({ uid: userUid });
      if (!oldUser) {
        throw new BadRequestException(`User with UID: ${userUid} not found`);
      }

      if (username && username !== oldUser.username) {
        const existsUsername = await this.authRepository.findOneBy({
          username: username.toLowerCase(),
        });

        if (existsUsername && existsUsername.uid !== userUid) {
          throw new BadRequestException(
            `Someone with the username: ${existsUsername.username} already exists.`,
          );
        }

        oldUser.username = username.toLowerCase();
      }

      if (name && oldUser.name !== name) {
        oldUser.name = name;
      }

      if (newPassword) {
        oldUser.password = bcryptjs.hashSync(newPassword, 10);
      }

      const savedUser = await this.authRepository.save(oldUser);
      if (!savedUser) {
        throw new InternalServerErrorException(
          `Error not handled yet Updating User Profile`,
        );
      }

      const {
        password: updatedPassword,
        roles,
        token,
        ...restUser
      } = savedUser;

      return {
        user: { ...restUser },
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
      const user = await this.authRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.panda', 'panda')
        .where('LOWER(user.username) = LOWER(:username)', { username })
        .getOne();

      if (!user) {
        throw new RpcException({
          status: 400,
          message: 'User does not exists on system.',
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

  async verify(token: string) {
    try {
      const { sub, iat, exp, ...user } = this.jwtService.verify(token, {
        secret: envs.jwtSecret,
      });

      const userFromDB = await this.authRepository.findOne({
        where: { uid: user.uid },
        relations: ['panda'],
      });
      if (!userFromDB) {
        throw new RpcException({
          status: 401,
          message: 'User not found with UID',
        });
      }

      const { password: __, ...restUser } = userFromDB;

      // STEP fetch current panda state
      const pandaUpdated = await firstValueFrom(
        this.client.send('find.one.panda', restUser.uid),
      );

      return {
        user: { ...restUser, panda: pandaUpdated },
        token: await this.singJWT(userFromDB),
      };
    } catch (error) {
      throw new RpcException({
        status: 401,
        message: 'Invalid token',
      });
    }
  }

  async findOne(uid: number): Promise<IOneUser> {
    try {
      const user = await this.authRepository.findOneBy({ uid });
      if (!user) {
        throw new RpcException({
          status: 401,
          message: `User not found with UID: ${uid}`,
        });
      }

      const { password, ...restUser } = user;

      return restUser;
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  async findAllUsers(
    findAllUsersDto: FindAllUsersDto,
  ): Promise<ICountAndListUsers> {
    const {
      limit = 10,
      page = 1,
      name = null,
      username = null,
      country = null,
      isActive = null,
      role = null,
    } = findAllUsersDto;

    const offset = (page - 1) * limit;

    const findOptions: FindManyOptions<Auth> = {
      take: limit,
      skip: offset,
      order: {
        name: 'ASC',
      },
    };

    const whereConditions: any = {
      roles: Like(`%${SecurityRoles.PLAYER}%`),
    };

    if (name) {
      whereConditions.name = Like(`%${name}%`);
    }
    if (username) {
      whereConditions.username = Like(`%${username}%`);
    }
    if (country) {
      whereConditions.country = Like(`%${country}%`);
    }
    if (isActive) {
      const activeValue = isActive === 'YES';
      whereConditions.isActive = activeValue;
    }
    if (role) {
      whereConditions.roles = Like(`%${role}%`);
    }

    if (Object.keys(whereConditions).length > 0) {
      findOptions.where = whereConditions;
    }

    try {
      const [players, total] =
        await this.authRepository.findAndCount(findOptions);

      const transformedPlayers = players.map((player) => {
        const { password, ...restPlayer } = player;
        return restPlayer;
      });

      return {
        total,
        page,
        users: transformedPlayers,
      };
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  async updatePoints(
    // add points by lesson completed or bot beaten
    updatePointsDto: UpdatePointsDto,
  ): Promise<IUpdatedPointsUser> {
    const { uid, points } = updatePointsDto;

    try {
      const user = await this.findOne(uid);
      const lastPoints = user.points;
      await this.authRepository.update(
        { uid },
        {
          points: user.points + points,
        },
      );

      return {
        lastPoints,
        earnedPoints: points,
        counter: lastPoints + points,
      };
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  // subtract points by panda actions
  async subtractPoints(
    updatePointsDto: UpdatePointsDto,
  ): Promise<ISubtractPointsUser> {
    const { uid, points } = updatePointsDto;

    try {
      const user = await this.findOne(uid);
      const lastPoints = user.points;
      if (lastPoints < points) {
        throw new BadRequestException(
          `${user.name}, your account balance is insufficient to execute that action with the Panda.`,
        );
      }

      await this.authRepository.update(
        { uid },
        {
          points: user.points - points,
        },
      );

      return {
        lastPoints,
        spentPoints: points,
        counter: lastPoints - points,
      };
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  // fetch users by uids
  async findUsersByUids(uids: number[]) {
    const users = await this.authRepository.find({
      where: { uid: In(uids) },
      select: ['uid', 'name'],
    });

    return users;
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
