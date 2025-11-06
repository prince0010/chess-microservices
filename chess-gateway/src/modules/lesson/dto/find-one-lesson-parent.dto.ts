import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class FindOneLessonParentDto {
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  userUid: number;

  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  lessonParentId: number;

  @IsOptional()
  @IsString()
  targetLanguage: string;
}
