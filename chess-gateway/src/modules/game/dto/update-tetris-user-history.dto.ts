import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class UpdateTetrisUserHistoryDto {
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  score: number;
}
