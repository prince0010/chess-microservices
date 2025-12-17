import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';
import { NotificationDestination, NotificationPurchaseType } from 'src/enum';

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
  @IsEnum(NotificationDestination, {
    message: `Only valid notifications destination these one: [${Object.values(NotificationDestination)}]`,
  })
  destination: NotificationDestination;

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
