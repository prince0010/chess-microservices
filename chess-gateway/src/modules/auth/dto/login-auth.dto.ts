import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class LoginAuthDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  username: string; // or email, it is the same

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsString()
  @IsIn(['YES'])
  fromWebsite?: string;
}
