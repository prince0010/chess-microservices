import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive, Min } from 'class-validator';

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
}
