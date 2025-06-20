import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive, Min } from 'class-validator';

export class FindAllWorldChessChampionLevelsDto {
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  userUid: number;

  @IsOptional()
  @IsPositive()
  @Type(() => Number) // converts query parameter string to number here
  limit?: number;

  @IsOptional()
  @Min(1)
  @Type(() => Number) // converts query parameter string to number here
  page?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  id?: number;

  @IsOptional()
  level?: string;
}
