import { Type } from 'class-transformer';
import { IsIn, IsOptional, IsPositive, IsString, Min } from 'class-validator';

export class FindAllTeachersDto {
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
  username?: string;

  @IsOptional()
  @IsString()
  @IsIn(['YES', 'NO'])
  isActive?: string;

  @IsOptional()
  @IsString()
  country?: string;
}
