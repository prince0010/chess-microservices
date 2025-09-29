import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { AuthTeacherService } from './auth-teacher.service';

import {
  RegisterAuthTeacherDto,
  UpdateAuthTeacherDto,
  FindAllTeachersDto,
  AddStudentsToTeacherDto,
  RequestJoinTeacherDto,
  UpdateApplicationStatusDto,
  RequestJoinFindAllDto,
} from './dto';

@Controller()
export class AuthTeacherController {
  constructor(private readonly authTeacherService: AuthTeacherService) {}

  // only ADMIN can register a teacher after approval
  @MessagePattern('auth.register.teacher')
  create(@Payload() registerAuthTeacherDto: RegisterAuthTeacherDto) {
    return this.authTeacherService.register(registerAuthTeacherDto);
  }

  @MessagePattern('auth.update.teacher')
  update(@Payload() updateAuthTeacherDto: UpdateAuthTeacherDto) {
    return this.authTeacherService.updateProfile(updateAuthTeacherDto);
  }

  @MessagePattern('auth.findOne.teacher')
  findOne(@Payload() uid: number) {
    return this.authTeacherService.findOne(uid);
  }

  @MessagePattern('auth.findAll.teachers')
  findAllTeachers(@Payload() findAllTeachersDto: FindAllTeachersDto) {
    return this.authTeacherService.findAllTeachers(findAllTeachersDto);
  }

  @MessagePattern('auth.addStudents.teacher')
  addStudents(@Payload() addStudentsToTeacherDto: AddStudentsToTeacherDto) {
    return this.authTeacherService.addStudents(addStudentsToTeacherDto);
  }

  // public endpoint where possible teacher submit data info
  @MessagePattern('auth.requestJoin.teacher')
  requestJoin(@Payload() requestJoinTeacherDto: RequestJoinTeacherDto) {
    return this.authTeacherService.requestJoin(requestJoinTeacherDto);
  }

  @MessagePattern('auth.findAll.requestJoin')
  findAllRequests(@Payload() requestJoinFindAllDto: RequestJoinFindAllDto) {
    return this.authTeacherService.findAllRequests(requestJoinFindAllDto);
  }

  @MessagePattern('auth.findOne.requestJoin')
  findOneRequest(@Payload() requestId: number) {
    return this.authTeacherService.findOneRequest(requestId);
  }

  // admin accept or reject teacher application
  @MessagePattern('auth.updateApplication.teacher')
  updateApplicationStatus(
    @Payload() updateApplicationStatusDto: UpdateApplicationStatusDto,
  ) {
    return this.authTeacherService.updateApplicationStatus(
      updateApplicationStatusDto,
    );
  }
}
