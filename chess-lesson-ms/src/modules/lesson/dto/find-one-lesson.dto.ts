import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class FindOneLessonDto {
  @IsOptional()
  @IsString()
  targetLanguage: string;

  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  userUid: number;

  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  lessonId: number;
}
