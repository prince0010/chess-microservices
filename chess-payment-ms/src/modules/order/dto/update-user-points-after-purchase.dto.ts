import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateUserPointsAfterPurchaseDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  uid: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  points: number;
}
