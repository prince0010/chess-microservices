import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';

export class VerifyInAppPurchaseDto {
  @IsPositive()
  @IsNumber()
  @IsNotEmpty()
  userUid: number;

  @IsNotEmpty()
  @IsString()
  storeProductId: string;

  @IsNotEmpty()
  @IsString()
  serverVerificationData: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(['app_store', 'google_play'])
  source: 'app_store' | 'google_play';
}
