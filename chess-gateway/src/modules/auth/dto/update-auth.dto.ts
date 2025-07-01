import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateAuthDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  name: string;

  @IsString()
  @IsOptional()
  username: string; // or email, it is the same

  @IsOptional()
  @IsString()
  @MinLength(6)
  password: string;
}
