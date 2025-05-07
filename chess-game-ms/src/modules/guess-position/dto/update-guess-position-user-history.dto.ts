import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class UpdateGuessPositionUserHistoryDto {
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  userUid: number;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  score: number;
}
