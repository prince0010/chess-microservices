import { Type } from 'class-transformer';
import { IsOptional, IsPositive, IsString, Min } from 'class-validator';

export class RequestJoinFindAllDto {
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
  name?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  country?: string;
}
