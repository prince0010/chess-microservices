import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import { NATS_SERVICE } from 'src/config';
import { VerifyInAppPurchaseDto } from './dto';

@Injectable()
export class VerifyInAppPurchaseService {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  async verifyInAppPurchase(dto: VerifyInAppPurchaseDto) {
    const { source } = dto;

    if (source === 'google_play') {
      return this.verifyGooglePlayPurchase(dto);
    }

    if (source === 'app_store') {
      return this.verifyApplePurchase(dto);
    }

    throw new RpcException({
      status: 400,
      message: 'INVALID_IAP_SOURCE',
    });
  }

  private async verifyGooglePlayPurchase(dto: VerifyInAppPurchaseDto) {
    // dto.serverVerificationData = purchaseToken
    // dto.storeProductId = productId
    // 1. Call Google Play Developer API
    // 2. Validate purchaseState === PURCHASED
    // 3. Check acknowledgement
    // 4. Prevent double-spend (store token)
    // 5. Create Order + mark PAID
    // 6. Grant items (points / subscriptions)
  }

  private async verifyApplePurchase(dto: VerifyInAppPurchaseDto) {
    // dto.serverVerificationData = Base64 receipt
    // 1. POST receipt to Apple verifyReceipt
    // 2. Handle sandbox vs production
    // 3. Validate bundleId
    // 4. Validate productId
    // 5. Prevent duplicate transactionId
    // 6. Create Order + mark PAID
    // 7. Grant items (points / subscriptions)
  }
}
