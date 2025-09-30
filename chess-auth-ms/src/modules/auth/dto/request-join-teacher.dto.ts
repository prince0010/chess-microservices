import { Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Gender, genderArray, TeacherRequestStatus } from 'src/enum';

export class RequestJoinTeacherDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  name: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  lastName: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  mobile: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(['YES', 'NO'])
  hasStudentsUsingApp: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(['YES', 'NO'])
  wantToBePresentedAsACoach: string;

  @IsOptional()
  @IsString()
  fideId?: string;

  @IsOptional()
  files: string[];

  @IsOptional()
  @IsString()
  languages?: string;
}

export class UpdateApplicationStatusDto {
  @IsNotEmpty()
  @IsNumber()
  applicationId: number;

  @IsNotEmpty()
  @IsEnum(TeacherRequestStatus, {
    message: `Valid status to update teacher application only these one: [${Object.values(TeacherRequestStatus)}]`,
  })
  status: string;
}
