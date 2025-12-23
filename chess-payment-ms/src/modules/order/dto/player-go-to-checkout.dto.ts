import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';
import { StorePlatform } from 'src/enum';

export class PlayerGoToCheckoutDto {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  userUid: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  itemId: number;

  @IsNotEmpty()
  @IsString()
  @IsIn([StorePlatform.APPLE_APP_STORE, StorePlatform.GOOGLE_PLAY_STORE])
  source: StorePlatform.APPLE_APP_STORE | StorePlatform.GOOGLE_PLAY_STORE;
}
