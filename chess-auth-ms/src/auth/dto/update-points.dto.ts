import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdatePointsDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  uid: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  points: number;
}
