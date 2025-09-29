import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';
import { Gender, genderArray } from 'src/enum';

export class RequestJoinTeacherDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  mobile: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  yearsExperience: number;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  age: number;

  @IsNotEmpty()
  @IsEnum(Gender, {
    message: `gender must be a valid enum value: [${[...genderArray]}]`,
  })
  gender: string;

  @IsOptional()
  @IsString()
  details?: string;

  @IsOptional()
  @ArrayMinSize(0)
  @IsArray()
  listExperience: string[];
}

export class UpdateApplicationStatusDto {
  @IsNotEmpty()
  @IsNumber()
  applicationId: number;

  @IsNotEmpty()
  @IsString()
  status: string;
}
