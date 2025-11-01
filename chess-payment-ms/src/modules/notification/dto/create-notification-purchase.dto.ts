import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';
import { NotificationPurchaseType } from 'src/enum';

export class CreateNotificationPurchaseDto {
  @IsNumber()
  @IsPositive()
  userUid: number;

  @IsNotEmpty()
  @IsEnum(NotificationPurchaseType, {
    message: `Only valid notifications type these one: [${Object.values(NotificationPurchaseType)}]`,
  })
  type: NotificationPurchaseType;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  message: string;

  @IsNotEmpty()
  @IsString()
  orderId: string;
}
