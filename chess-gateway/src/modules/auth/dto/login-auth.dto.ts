import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginAuthDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  username: string; // or email, it is the same

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
