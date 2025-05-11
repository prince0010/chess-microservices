import { Type } from 'class-transformer';
import { IsNumber, IsPositive } from 'class-validator';

export class FindOneLessonParentDto {
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  userUid: number;

  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  lessonParentId: number;
}
