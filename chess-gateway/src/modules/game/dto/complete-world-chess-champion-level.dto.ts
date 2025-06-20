import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class CompleteWorldChessChampionLevelDto {
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  worldChessChampionLevelId: number;
}
