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
import { AuthTeacher } from './entities/auth-teacher.entity';
import { AuthPanda } from 'src/modules/panda/entities/auth-panda.entity';

import { RegisterAuthDto } from './dto/register-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { UpdateUserPointsDto } from './dto/update-user-points.dto';
import { FindAllStudentsDto, FindAllUsersDto } from './dto/find-all-users.dto';
import { UpdatePandaUserPointsDto } from '../panda/dto/update-panda-user-points.dto';
import { SecurityRoles, TypeUserCounter } from 'src/enum';
import {
  JwtPayload,
  IOneUser,
  IUpdatedPointsUser,
  ISubtractPointsUser,
  ICountAndListUsers,
  ICountAndListStudents,
} from './interfaces';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,

    @InjectRepository(AuthTeacher)
    private readonly authTeacherRepository: Repository<AuthTeacher>,

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
      const existsTeacherWithUsername =
        await this.authTeacherRepository.findOneBy({
          username: username.toLowerCase(),
        });

      if (existsUsername && existsUsername.isActive === false) {
        throw new BadRequestException(
          `Not possible to register with specific credentials. That account was deleted time ago by user decision.`,
        );
      }

      if (existsUsername || existsTeacherWithUsername) {
        throw new BadRequestException(
          `Someone with the username: ${username} already exists.`,
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

  async deleteAccount(
    userUid: number,
  ): Promise<{ success: boolean; errorMessage?: string }> {
    try {
      const user = await this.authRepository.findOneBy({ uid: userUid });
      if (!user) {
        return {
          success: false,
          errorMessage: `User with UID: ${userUid} not found`,
        };
      }

      await this.authRepository.update({ uid: userUid }, { isActive: false });

      return { success: true, errorMessage: null };
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  async login(loginAuthDto: LoginAuthDto) {
    const { username, password, fromWebsite = null } = loginAuthDto;

    try {
      let user: Auth | AuthTeacher | null = null;
      const userAuth = await this.authRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.panda', 'panda')
        .where('LOWER(user.username) = LOWER(:username)', { username })
        .getOne();

      // it is a player or admin
      if (userAuth) {
        user = userAuth;

        // Rule APP. Only players can login from APP
        if (!fromWebsite && userAuth.roles[0] !== SecurityRoles.PLAYER) {
          throw new RpcException({
            status: 400,
            message: 'Player not found.',
          });
        }

        // it could be a teacher
      } else {
        // teachers not possible from APP
        if (!fromWebsite) {
          throw new RpcException({
            status: 400,
            message: 'Player not found.',
          });
        }

        const userTeacher = await this.authTeacherRepository.findOneBy({
          username: username.toLowerCase(),
        });

        if (userTeacher) {
          user = userTeacher;
        }
      }

      if (!user || user.isActive === false) {
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

      let userFromDB: Auth | AuthTeacher | null = null;
      let isUserPlayer: boolean = true;

      const userAuth = await this.authRepository.findOne({
        where: {
          uid: user.uid,
          username: user.username,
        },
        relations: ['panda'],
      });

      if (userAuth) {
        userFromDB = userAuth;
      } else {
        const userTeacher = await this.authTeacherRepository.findOne({
          where: {
            uid: user.uid,
            username: user.username,
          },
        });

        if (userTeacher) {
          userFromDB = userTeacher;
          isUserPlayer = false;
        }
      }

      if (!userFromDB || userFromDB.isActive === false) {
        throw new RpcException({
          status: 401,
          message: 'User not found with UID',
        });
      }

      const { password: __, ...restUser } = userFromDB;

      // STEP fetch current panda state
      const pandaUpdated =
        isUserPlayer &&
        (await firstValueFrom(
          this.client.send('find.one.panda', restUser.uid),
        ));

      return {
        user: {
          ...restUser,
          panda: isUserPlayer ? pandaUpdated : null,
        },
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
      const user = await this.authRepository.findOne({
        where: { uid },
        relations: { teachers: true },
      });
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
      user,
      limit = 10,
      page = 1,
      name = null,
      username = null,
      country = null,
      isActive = 'YES', // by default only active players
      role = null,
    } = findAllUsersDto;

    const offset = (page - 1) * limit;
    const isTeacher = user.roles.includes(SecurityRoles.TEACHER);

    const findOptions: FindManyOptions<Auth> = {
      take: limit,
      skip: offset,
      relations: { teachers: true },
      order: {
        name: 'ASC',
      },
    };

    const whereConditions: any = {
      roles: Like(`%${SecurityRoles.PLAYER}%`),
    };

    if (isTeacher) {
      whereConditions.teachers = { uid: user.uid };
    }
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

  /* endpoint where teacher needs all students to select them */
  async findAllStudents(
    findAllStudentsDto: FindAllStudentsDto,
  ): Promise<ICountAndListStudents> {
    const {
      limit = 10,
      page = 1,
      name = null,
      username = null,
      country = null,
    } = findAllStudentsDto;

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

    if (Object.keys(whereConditions).length > 0) {
      findOptions.where = whereConditions;
    }

    try {
      const [students, total] =
        await this.authRepository.findAndCount(findOptions);

      const transformedStudents = students.map((student) => {
        const { password, ...restStudent } = student;
        return restStudent;
      });

      return {
        total,
        page,
        students: transformedStudents,
      };
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  async updatePoints(
    // add points by lesson completed or bot beaten or some game
    updateUserPointsDto: UpdateUserPointsDto,
  ): Promise<IUpdatedPointsUser> {
    const { uid, points, typeUserCounter = null } = updateUserPointsDto;

    try {
      const user = await this.findOne(uid);
      const lastPoints = user.points;
      const lastTotalScore = user.totalScore;

      // global panda points and total score
      user.points = lastPoints + points;
      if (points < 1000 * 1000) {
        // avoid add million points due to payment purchase package
        user.totalScore = lastTotalScore + points;
      }

      if (typeUserCounter) {
        switch (typeUserCounter) {
          case TypeUserCounter.EDUCATION_LESSON_COUNTER:
            user.educationPoints = user.educationPoints + points;
            break;
          case TypeUserCounter.PUZZLE_LESSON_COUNTER:
            user.puzzlePoints = user.puzzlePoints + points;
            break;
          case TypeUserCounter.ENDGAMES_LESSON_COUNTER:
            user.endgamesPoints = user.endgamesPoints + points;
            break;
          case TypeUserCounter.ANIMAL_BOT_COUNTER:
            user.animalPoints = user.animalPoints + points;
            break;

          default:
            break;
        }
      }

      await this.authRepository.save(user);

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
    updatePandaUserPointsDto: UpdatePandaUserPointsDto,
  ): Promise<ISubtractPointsUser> {
    const { uid, points } = updatePandaUserPointsDto;

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
  private getJwtPayload(user: Auth | AuthTeacher): JwtPayload {
    return {
      uid: user.uid,
      name: user.name,
      username: user.username,
    };
  }

  private async singJWT(user: Auth | AuthTeacher) {
    return this.jwtService.sign(this.getJwtPayload(user));
  }
}
