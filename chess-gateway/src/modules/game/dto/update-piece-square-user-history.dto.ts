import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class UpdatePieceSquareUserHistoryDto {
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  score: number;
}
