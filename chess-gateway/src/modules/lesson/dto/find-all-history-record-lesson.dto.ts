import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsPositive, Min } from 'class-validator';
import { LessonLevel, lessonLevelsArray } from 'src/enum';

export class FindAllHistoryRecordLessonDto {
  @IsOptional()
  @IsPositive()
  @Type(() => Number) // converts query parameter string to number here
  limit?: number;

  @IsOptional()
  @Min(1)
  @Type(() => Number) // converts query parameter string to number here
  page?: number;

  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  lessonParentId: number;

  @IsOptional()
  @IsEnum(LessonLevel, {
    message: `Invalid level name. Try to send one of these valid one: [${[...lessonLevelsArray]}]`,
  })
  level?: string;
}
