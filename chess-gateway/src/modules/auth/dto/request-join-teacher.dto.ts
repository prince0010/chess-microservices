import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

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
  @IsString()
  status: string;
}
