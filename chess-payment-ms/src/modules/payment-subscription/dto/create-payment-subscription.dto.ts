import { IsNotEmpty, IsNumber, IsOptional, IsPositive } from 'class-validator';

export class CreatePaymentSubscriptionDto {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  userUid: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  durationDays?: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  itemId: number;
}
