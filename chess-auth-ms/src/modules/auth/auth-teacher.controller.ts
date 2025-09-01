import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { AuthTeacherService } from './auth-teacher.service';

import {
  RegisterAuthTeacherDto,
  UpdateAuthTeacherDto,
  FindAllTeachersDto,
  AddStudentsToTeacherDto,
  FindAllStudentsByTeacherDto,
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

  @MessagePattern('auth.findStudents.teacher')
  findListStudentsByTeacher(
    @Payload() findAllStudentsByTeacherDto: FindAllStudentsByTeacherDto,
  ) {
    return this.authTeacherService.findStudents(findAllStudentsByTeacherDto);
  }
}
