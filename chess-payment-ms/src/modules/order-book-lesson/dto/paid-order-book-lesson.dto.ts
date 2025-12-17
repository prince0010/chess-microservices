import { IsString, IsUrl, IsUUID } from 'class-validator';

export class PaidOrderBookLessonDto {
  @IsString()
  stripePaymentId: string;

  @IsString()
  @IsUUID()
  orderBookLessonId: string;

  @IsString()
  @IsUrl()
  receiptUrl: string;
}

export class FailedOrderBookLessonDto {
  @IsString()
  stripePaymentId: string;

  @IsString()
  @IsUUID()
  orderBookLessonId: string;
}
