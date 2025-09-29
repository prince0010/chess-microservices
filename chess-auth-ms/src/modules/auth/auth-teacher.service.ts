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
import * as bcryptjs from 'bcryptjs';

import { NATS_SERVICE } from 'src/config';
import { Auth } from './entities/auth.entity';
import { AuthTeacher } from './entities/auth-teacher.entity';
import { AuthTeacherRequest } from './entities/auth-teacher-request.entity';

import {
  AddStudentsToTeacherDto,
  FindAllTeachersDto,
  RegisterAuthTeacherDto,
  RequestJoinTeacherDto,
  UpdateAuthTeacherDto,
} from './dto';

import { JwtPayload, IOneTeacher, ICountAndListTeachers } from './interfaces';
import { UpdateApplicationStatusDto } from './dto/request-join-teacher.dto';
import { SecurityRoles, TeacherRequestStatus } from 'src/enum';

@Injectable()
export class AuthTeacherService {
  constructor(
    @InjectRepository(AuthTeacher)
    private readonly authTeacherRepository: Repository<AuthTeacher>,

    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,

    @InjectRepository(AuthTeacherRequest)
    private readonly authTeacherRequestRepository: Repository<AuthTeacherRequest>,

    private readonly jwtService: JwtService,
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
  ) {}

  // only ADMIN can register new teachers
  async register(
    registerAuthTeacherDto: RegisterAuthTeacherDto,
  ): Promise<string> {
    const { password, username, ...restTeacher } = registerAuthTeacherDto;

    try {
      const existsUsernameInAuthTeacher =
        await this.authTeacherRepository.findOneBy({
          username: username.toLowerCase(),
        });
      const existsUsernameInAuth = await this.authRepository.findOneBy({
        username: username.toLowerCase(),
      });

      if (existsUsernameInAuthTeacher || existsUsernameInAuth) {
        throw new BadRequestException(
          `Someone with the username: ${username} already exists.`,
        );
      }

      const newTeacher = this.authTeacherRepository.create({
        username: username.toLowerCase(),
        password: bcryptjs.hashSync(password, 10),
        ...restTeacher,
      });

      const savedTeacher = await this.authTeacherRepository.save(newTeacher);

      return `Teacher with name: ${savedTeacher.name} registered successfully.`;
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  async updateProfile(
    updateAuthTeacherDto: UpdateAuthTeacherDto,
  ): Promise<any> {
    const {
      teacherUid,
      name = null,
      password: newPassword = null,
      username = null,
    } = updateAuthTeacherDto;

    try {
      const oldTeacher = await this.authTeacherRepository.findOneBy({
        uid: teacherUid,
      });
      if (!oldTeacher) {
        throw new BadRequestException(
          `Teacher with UID: ${teacherUid} not found`,
        );
      }

      if (username && username !== oldTeacher.username) {
        const existsUsernameInAuthTeacher =
          await this.authTeacherRepository.findOneBy({
            username: username.toLowerCase(),
          });

        const existsUsernameInAuth = await this.authRepository.findOneBy({
          username: username.toLowerCase(),
        });

        if (
          (existsUsernameInAuthTeacher &&
            existsUsernameInAuthTeacher.uid !== teacherUid) ||
          (existsUsernameInAuth && existsUsernameInAuth.uid !== teacherUid)
        ) {
          throw new BadRequestException(
            `Someone with the username: ${username} already exists.`,
          );
        }

        oldTeacher.username = username.toLowerCase();
      }

      if (name && oldTeacher.name !== name) {
        oldTeacher.name = name;
      }

      if (newPassword) {
        oldTeacher.password = bcryptjs.hashSync(newPassword, 10);
      }

      const savedTeacher = await this.authTeacherRepository.save(oldTeacher);
      if (!savedTeacher) {
        throw new InternalServerErrorException(
          `Error not handled yet Updating Teacher Profile`,
        );
      }

      const { password: updatedPassword, token, ...restTeacher } = savedTeacher;

      return {
        user: { ...restTeacher },
        token: await this.singJWT(savedTeacher),
      };
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  async findOne(uid: number): Promise<IOneTeacher> {
    try {
      const teacher = await this.authTeacherRepository.findOne({
        where: { uid },
        relations: { students: true },
      });
      if (!teacher) {
        throw new RpcException({
          status: 401,
          message: `Teacher not found with UID: ${uid}`,
        });
      }

      const { password, ...restTeacher } = teacher;

      return restTeacher;
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  async findAllTeachers(
    findAllTeachersDto: FindAllTeachersDto,
  ): Promise<ICountAndListTeachers> {
    const {
      limit = 10,
      page = 1,
      name = null,
      username = null,
      country = null,
      isActive = null,
    } = findAllTeachersDto;

    const offset = (page - 1) * limit;

    const findOptions: FindManyOptions<AuthTeacher> = {
      take: limit,
      skip: offset,
      order: {
        name: 'ASC',
      },
    };

    const whereConditions: any = {
      // roles: Like(`%${SecurityRoles.TEACHER}%`),
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

    if (Object.keys(whereConditions).length > 0) {
      findOptions.where = whereConditions;
    }

    try {
      const [teachers, total] =
        await this.authTeacherRepository.findAndCount(findOptions);

      const transformedTeachers = teachers.map((player) => {
        const { password, ...restTeacher } = player;
        return restTeacher;
      });

      return {
        total,
        page,
        teachers: transformedTeachers,
      };
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  async addStudents(
    addStudentsToTeacherDto: AddStudentsToTeacherDto,
  ): Promise<string> {
    const { teacherUid, studentUids } = addStudentsToTeacherDto;

    try {
      // STEP 1: validate teacher exists
      const teacherEntity = await this.authTeacherRepository.findOneBy({
        uid: teacherUid,
      });
      if (!teacherEntity) {
        throw new RpcException({
          status: 404,
          message: `Teacher not found with UID: ${teacherUid}`,
        });
      }

      // STEP 2: validate students length
      const studentEntitiesArray = await this.authRepository.find({
        where: { uid: In(studentUids) },
      });

      if (studentEntitiesArray.length !== studentUids.length) {
        throw new RpcException({
          status: 404,
          message: `Some students not found`,
        });
      }

      // STEP 3: update students of that teacher
      teacherEntity.students = studentEntitiesArray;

      await this.authTeacherRepository.save(teacherEntity);

      return `Students of teacher ${teacherEntity.name} updated successfully`;
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  async requestJoin(
    requestJoinTeacherDto: RequestJoinTeacherDto,
  ): Promise<string> {
    const {
      mobile,
      email,
      listExperience = [],
      ...restDto
    } = requestJoinTeacherDto;

    try {
      // Check in both pending applications and active teachers
      const [existingApplication, existingTeacher] = await Promise.all([
        this.authTeacherRequestRepository.findOne({
          where: [{ email: email.toLowerCase() }, { mobile }],
        }),
        this.authTeacherRepository.findOne({
          where: [{ username: email.toLowerCase() }, { mobile }],
        }),
      ]);

      if (existingApplication || existingTeacher) {
        throw new BadRequestException(
          `An application already exists with this email or mobile number.`,
        );
      }

      const newApplication = this.authTeacherRequestRepository.create({
        email: email.toLowerCase(),
        mobile,
        listExperience,
        ...restDto,
      });

      await this.authTeacherRequestRepository.save(newApplication);

      return 'Thanks for applying, we will let you know as soon as possible.';
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  async updateApplicationStatus(
    updateApplicationStatusDto: UpdateApplicationStatusDto,
  ) {
    const { status, applicationId } = updateApplicationStatusDto;

    try {
      const application = await this.authTeacherRequestRepository.findOneBy({
        id: applicationId,
      });
      if (!application) {
        throw new BadRequestException(
          `Application with ID: ${applicationId} not found.`,
        );
      }
      if (status === TeacherRequestStatus.pending) {
        await this.authTeacherRequestRepository.update(
          { id: application.id },
          { status: status },
        );

        return 'Teacher request application marked as PENDING successfully.';
      }

      // STEP 1: update status application
      await this.authTeacherRequestRepository.update(
        { id: application.id },
        { status: status },
      );

      // STEP 2: in case approved create the teacher with the email as username and temporary password 123456
      if (status === TeacherRequestStatus.approved) {
        const newTeacher = this.authTeacherRepository.create({
          name: application.name,
          username: application.email,
          password: '123456',
          country: application.country,
          roles: [SecurityRoles.TEACHER as string],
          gender: application.gender,
          mobile: application.mobile,
        });

        await this.authTeacherRequestRepository.save(newTeacher);

        return `Teacher with username: ${application.email} created successfully with a temporary password: 123456`;
      }

      return 'Teacher request application rejected successfully.';
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  // ==== private methods ====
  private getJwtPayload(teacher: AuthTeacher): JwtPayload {
    return {
      uid: teacher.uid,
      name: teacher.name,
      username: teacher.username,
    };
  }

  private async singJWT(teacher: AuthTeacher) {
    return this.jwtService.sign(this.getJwtPayload(teacher));
  }
}
