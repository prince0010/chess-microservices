import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { StorePlatform } from 'src/enum';

export class VerifyInAppPurchaseDto {
  @IsNotEmpty()
  @IsString()
  storeProductId: string;

  @IsNotEmpty()
  @IsString()
  serverVerificationData: string;

  @IsNotEmpty()
  @IsString()
  @IsIn([StorePlatform.APPLE_APP_STORE, StorePlatform.GOOGLE_PLAY_STORE])
  source: StorePlatform.APPLE_APP_STORE | StorePlatform.GOOGLE_PLAY_STORE;
}
