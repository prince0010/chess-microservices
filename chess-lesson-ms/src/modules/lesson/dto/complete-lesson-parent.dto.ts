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
  @IsNotEmpty()
  userUid: number;

  @IsNumber()
  @IsPositive()
  lessonParentId: number;

  @IsArray()
  @ArrayMinSize(1)
  @IsNumber({}, { each: true })
  @Type(() => Number)
  completedLessonIds: number[]; // [1, 2, 3, 5, 6 ...]

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  earnedPoints?: number; // this prop is useful for all Levels except Level 1

  @IsOptional()
  @IsBoolean()
  challengeAchieved?: boolean; // this prop is useful to know if player achieve the challenge to solve 10 correct puzzles in a row and withing 15 seconds

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
