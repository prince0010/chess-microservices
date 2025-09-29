import { AuthTeacherRequest } from '../entities/auth-teacher-request.entity';
import { IOneUser } from './user.interface';

export interface ICountAndListTeachers {
  total: number;
  page: number;
  teachers: IOneTeacher[];
}
export interface IOneTeacher {
  uid: number;
  name: string;
  username: string;
  country: string;
  gender: string;
  birthday: Date | null;
  isActive: boolean;
}

export interface ICountAndListStudentsByTeacher {
  total: number;
  page: number;
  students: IOneUser[];
}

export interface ICountAndListRequests {
  total: number;
  page: number;
  requests: AuthTeacherRequest[];
}
