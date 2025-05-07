import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class UpdateGuessPositionUserHistoryDto {
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  score: number;
}
