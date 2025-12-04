import { Type } from 'class-transformer';
import { IsIn, IsOptional, IsPositive, IsString, Min } from 'class-validator';

export class FindAllCoachesDto {
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  limit?: number;

  @IsOptional()
  @Min(1)
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @IsString()
  query?: string;

  @IsOptional()
  @IsString()
  @IsIn(['YES', 'NO'])
  isActive?: string;
}
