import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsPositive,
} from 'class-validator';

export class CompleteLessonParentDto {
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  userUid: number;

  @IsNumber()
  @IsPositive()
  lessonParentId: number;

  @IsArray()
  @ArrayMinSize(0)
  @IsNumber({}, { each: true })
  @Type(() => Number)
  completedLessonIds: number[]; // [1, 2, 3, 5, 6 ...]
}

export class UserUidDto {
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  userUid: number;
}
