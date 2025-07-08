import { Type } from 'class-transformer';
import { IsOptional, IsPositive, Min } from 'class-validator';

export class FindAllHistoryRecordLessonTestDto {
  @IsOptional()
  @IsPositive()
  @Type(() => Number) // converts query parameter string to number here
  limit?: number;

  @IsOptional()
  @Min(1)
  @Type(() => Number) // converts query parameter string to number here
  page?: number;
}
