import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
} from 'class-validator';

export class CompleteLessonParentDto {
  @IsNumber()
  @IsPositive()
  lessonParentId: number;

  @IsArray()
  @ArrayMinSize(1)
  @IsNumber({}, { each: true }) // Validate each element is a number
  @Type(() => Number)
  completedLessonIds: number[]; // [1, 2, 3, 5, 6 ...]

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  failedLessonId?: number; // this prop tell us the lessonId where player fails and lost their 3 lives
}

export class UserUidDto {
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  userUid: number;
}
