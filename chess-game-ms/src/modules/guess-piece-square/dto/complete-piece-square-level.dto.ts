import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class CompletePieceSquareLevelDto {
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  pieceSquareLevelId: number;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  userUid: number;
}
