import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { NATS_SERVICE } from 'src/config';
import { GoogleIapService } from './google-iap.service';
import { AppleIapService } from './apple-iap.service';

import { InAppPurchaseRequestDto } from './dto';
import { StorePlatform } from 'src/enum';

@Injectable()
export class IapService {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
    private readonly appleIapService: AppleIapService,
    private readonly googleIapService: GoogleIapService,
  ) {}

  async newRequestInAppPurchase(dto: InAppPurchaseRequestDto) {
    try {
      if (dto.source === StorePlatform.GOOGLE_PLAY_STORE) {
        return await this.googleIapService.newRequest(dto);
      }

      if (dto.source === StorePlatform.APPLE_APP_STORE) {
        return await this.appleIapService.newRequest(dto);
      }
    } catch (error) {
      return {
        success: false,
        orderId: null,
        item: null,
        errorMessage: 'UNHANDLED_ERROR_ON_NEW_REQUEST_IN_APP_PURCHASE',
        alreadyProcessed: false,
      };
    }
  }
}
