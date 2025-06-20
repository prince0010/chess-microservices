import { Type } from 'class-transformer';
import { IsNumber, IsPositive } from 'class-validator';

export class FindOneWorldChessChampionLevelByUserDto {
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  worldChessChampionLevelId: number;

  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  userUid: number;
}
