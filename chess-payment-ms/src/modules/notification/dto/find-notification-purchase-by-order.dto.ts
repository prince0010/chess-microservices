import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class FindNotificationPurchaseByOrderDto {
  @IsNumber()
  @IsPositive()
  userUid: number;

  @IsNotEmpty()
  @IsString()
  orderId: string;
}
