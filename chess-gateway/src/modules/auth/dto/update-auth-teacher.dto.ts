import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateAuthTeacherDto {
  @IsString()
  @IsOptional()
  @MinLength(3)
  name: string;

  @IsString()
  @IsOptional()
  username: string; // or email, it is the same

  @IsString()
  @IsOptional()
  @MinLength(6)
  password: string;
}
