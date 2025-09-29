import { Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
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
  country: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  yearsExperience: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  age: number;

  @IsNotEmpty()
  @IsEnum(Gender, {
    message: `gender must be a valid enum value: [${[...genderArray]}]`,
  })
  gender: string;

  @IsOptional()
  files: string[];

  @IsOptional()
  @IsString()
  details?: string;

  @IsOptional()
  @IsString()
  listExperience?: string;
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
