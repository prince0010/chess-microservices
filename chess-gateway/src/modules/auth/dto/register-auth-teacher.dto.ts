import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Gender, genderArray } from 'src/enum';

export class RegisterAuthTeacherDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name: string;

  @IsString()
  @IsNotEmpty()
  username: string; // or email, it is the same

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsNotEmpty()
  @IsEnum(Gender, {
    message: `gender must be a valid enum value: [${[...genderArray]}]`,
  })
  gender: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  birthday?: Date;
}
