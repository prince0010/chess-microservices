import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { StorePlatform } from 'src/enum';

export class PaidOrderAppDto {
  @IsString()
  @IsUUID()
  orderId: string;

  @IsNotEmpty()
  @IsEnum(StorePlatform)
  source: StorePlatform;

  @IsNotEmpty()
  rawReceipt: any;
}

export class FailedOrderAppDto {
  @IsString()
  @IsUUID()
  orderId: string;
}
