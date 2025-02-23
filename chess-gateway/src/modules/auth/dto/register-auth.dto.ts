import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Gender, genderArray } from 'src/enum';

export class RegisterAuthDto {
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

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsOptional()
  @IsEnum(Gender, {
    message: `gender must be a valid enum value: [${[...genderArray]}]`,
  })
  gender?: string;

  @IsOptional()
  @IsDate()
  birthday?: Date;
}
