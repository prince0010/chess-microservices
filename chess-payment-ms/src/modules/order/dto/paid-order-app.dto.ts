import { IsString, IsUrl, IsUUID } from 'class-validator';

export class PaidOrderAppDto {
  @IsString()
  storePaymentId: string;

  @IsString()
  @IsUUID()
  orderId: string;

  @IsString()
  @IsUrl()
  receiptUrl: string;
}

export class FailedOrderAppDto {
  @IsString()
  storePaymentId: string;

  @IsString()
  @IsUUID()
  orderId: string;
}
