import { Type } from 'class-transformer';
import {
  ArrayContains,
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Gender, genderArray, SecurityRoles } from 'src/enum';

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

  @IsOptional()
  @IsString()
  country?: string;

  @IsEnum(Gender, {
    message: `gender must be a valid enum value: [${[...genderArray]}]`,
  })
  gender: string;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(1)
  @IsString({ each: true })
  @ArrayContains([SecurityRoles.PLAYER])
  roles: string[]; // only player can be registered via regular endpoint

  @IsOptional()
  // @IsString() // Validate as a string (if received as a string)
  @IsDate() // Validate as a Date object
  @Type(() => Date) // Converts from string to Date automatically
  birthday?: Date;
}
