import { Type } from 'class-transformer';
import { IsOptional, IsPositive, IsString, Min } from 'class-validator';

export class FindAllLessonAdvancedDto {
  @IsOptional()
  @IsPositive()
  @Type(() => Number) // converts query parameter string to number here
  limit?: number;

  @IsOptional()
  @Min(1)
  @Type(() => Number) // converts query parameter string to number here
  page?: number;

  @IsOptional()
  @IsString()
  description?: string;
}
