import axios from 'axios';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { GoogleAuth } from 'google-auth-library';
import { firstValueFrom } from 'rxjs';

import { envs, NATS_SERVICE } from 'src/config';
import { Item } from '../item/entities/item.entity';
import { OrderService } from './order.service';

import {
  CreateOrderAppDto,
  PaidOrderAppDto,
  VerifyInAppPurchaseDto,
} from './dto';
import { StorePlatform } from 'src/enum';
import { IPaymentInAppPurchaseResponse } from 'src/interfaces';

@Injectable()
export class VerifyInAppPurchaseService {
  private googleAuth = new GoogleAuth({
    credentials: JSON.parse(envs.googleServiceAccountJson),
    scopes: ['https://www.googleapis.com/auth/androidpublisher'],
  });

  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
    private readonly orderService: OrderService,
  ) {}

  // Entry point
  async verifyInAppPurchase(
    dto: VerifyInAppPurchaseDto,
  ): Promise<IPaymentInAppPurchaseResponse> {
    if (dto.source === StorePlatform.GOOGLE_PLAY_STORE) {
      return this.verifyGoogle(dto);
    }

    if (dto.source === StorePlatform.APPLE_APP_STORE) {
      return this.verifyApple(dto);
    }

    throw new RpcException({
      status: 400,
      message: 'INVALID_IAP_SOURCE',
    });
  }

  // ============= GOOGLE =============
  private async verifyGoogle(
    dto: VerifyInAppPurchaseDto,
  ): Promise<IPaymentInAppPurchaseResponse> {
    const { storeProductId, serverVerificationData, userUid } = dto;
    const packageName = envs.androidPackageName;

    const authClient = await this.googleAuth.getClient();
    const accessToken = await authClient.getAccessToken();

    const url =
      `https://androidpublisher.googleapis.com/androidpublisher/v3/applications/` +
      `${packageName}/purchases/products/${storeProductId}/tokens/${serverVerificationData}`;

    const { data } = await axios.get(url, {
      headers: { Authorization: `Bearer ${accessToken.token}` },
    });

    if (data.purchaseState !== 0) {
      throw new RpcException({
        status: 400,
        message: 'GOOGLE_PURCHASE_NOT_COMPLETED',
      });
    }

    // Acknowledge (mandatory)
    if (data.acknowledgementState === 0) {
      await axios.post(
        `${url}:acknowledge`,
        {},
        { headers: { Authorization: `Bearer ${accessToken.token}` } },
      );
    }

    return await this.createPaidOrder({
      userUid,
      storeChargeId: data.orderId,
      storeProductId,
      source: StorePlatform.GOOGLE_PLAY_STORE,
      rawReceipt: data,
    });
  }

  // ============= APPLE =============
  private async verifyApple(
    dto: VerifyInAppPurchaseDto,
  ): Promise<IPaymentInAppPurchaseResponse> {
    const payload = {
      'receipt-data': dto.serverVerificationData,
      password: envs.appleInAppPurchaseKey,
      'exclude-old-transactions': true,
    };

    let response = await axios.post(
      'https://buy.itunes.apple.com/verifyReceipt',
      payload,
    );

    if (response.data.status === 21007) {
      response = await axios.post(
        'https://sandbox.itunes.apple.com/verifyReceipt',
        payload,
      );
    }

    if (response.data.status !== 0) {
      throw new RpcException({
        status: 400,
        message: 'APPLE_RECEIPT_INVALID',
      });
    }

    const receiptInfo =
      response.data.latest_receipt_info?.[0] ??
      response.data.receipt?.in_app?.[0];

    if (!receiptInfo) {
      throw new RpcException({
        status: 400,
        message: 'APPLE_NO_RECEIPT_FOUND',
      });
    }

    if (receiptInfo.product_id !== dto.storeProductId) {
      throw new RpcException({
        status: 400,
        message: 'APPLE_PRODUCT_MISMATCH',
      });
    }

    return await this.createPaidOrder({
      userUid: dto.userUid,
      storeChargeId: receiptInfo.transaction_id,
      storeProductId: receiptInfo.product_id,
      source: StorePlatform.APPLE_APP_STORE,
      rawReceipt: receiptInfo,
    });
  }

  // ================= ORDER CREATION =================
  private async createPaidOrder(data: {
    userUid: number;
    storeChargeId: string;
    storeProductId: string;
    source: StorePlatform;
    rawReceipt: any;
  }): Promise<IPaymentInAppPurchaseResponse> {
    try {
      // Create order (PENDING)
      const payloadNewOrder: CreateOrderAppDto = {
        storeChargeId: data.storeChargeId,
        userUid: data.userUid,
        source: data.source,
        items: [
          {
            itemId: await this.resolveItemId(data.storeProductId),
            quantity: 1,
          },
        ],
      };
      const order = await this.orderService.create(payloadNewOrder);

      // Mark order as PAID
      const payloadPaidOrder: PaidOrderAppDto = {
        orderId: order.id,
        source: data.source,
        rawReceipt: data.rawReceipt,
      };
      await this.orderService.markOrderAppAsPaid(payloadPaidOrder);

      return {
        success: true,
        orderId: order.id,
      };
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  private async resolveItemId(storeProductId: string): Promise<number> {
    const item: Item = await firstValueFrom(
      this.client.send('item.find.storeProductId', storeProductId),
    );

    if (!item) {
      throw new RpcException({
        status: 400,
        message: 'ITEM_NOT_FOUND',
      });
    }

    return item.id;
  }
}
