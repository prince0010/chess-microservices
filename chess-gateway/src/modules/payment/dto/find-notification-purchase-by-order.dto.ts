import { IsNotEmpty, IsString } from 'class-validator';

export class FindNotificationPurchaseByOrderDto {
  @IsNotEmpty()
  @IsString()
  orderId: string;
}
