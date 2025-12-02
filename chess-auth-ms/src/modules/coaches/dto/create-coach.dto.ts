import { PartialType } from '@nestjs/mapped-types';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateCoachDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  chessTitle: string;

  @IsNotEmpty()
  @IsString()
  photoUrl: string;

  @IsNotEmpty()
  @IsString()
  cvUrl: string;

  @IsArray()
  @IsString({ each: true })
  languages: string[];

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  price: number;
}

export class UpdateCoachDto extends PartialType(CreateCoachDto) {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  id: number;
}
