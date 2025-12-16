import axios from 'axios';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { GoogleAuth } from 'google-auth-library';

import { NATS_SERVICE } from 'src/config';

import { VerifyInAppPurchaseDto } from './dto';

@Injectable()
export class VerifyInAppPurchaseService {
  private googleAuth = new GoogleAuth({
    credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON),
    scopes: ['https://www.googleapis.com/auth/androidpublisher'],
  });

  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  // ============= Entry point =============
  async verifyInAppPurchase(dto: VerifyInAppPurchaseDto) {
    if (dto.source === 'google_play') {
      return this.verifyGooglePlayPurchase(dto);
    }

    if (dto.source === 'app_store') {
      return this.verifyApplePurchase(dto);
    }

    throw new RpcException({
      status: 400,
      message: 'INVALID_IAP_SOURCE',
    });
  }

  // ============= GOOGLE PLAY =============
  private async verifyGooglePlayPurchase(dto: VerifyInAppPurchaseDto) {
    const { storeProductId, serverVerificationData } = dto;
    const packageName = process.env.ANDROID_PACKAGE_NAME;

    const authClient = await this.googleAuth.getClient();
    const accessToken = await authClient.getAccessToken();

    const url =
      `https://androidpublisher.googleapis.com/androidpublisher/v3/applications/` +
      `${packageName}/purchases/products/${storeProductId}/tokens/${serverVerificationData}`;

    const { data } = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken.token}`,
      },
    });

    /**
     * purchaseState
     * 0 = PURCHASED
     * 1 = CANCELED
     * 2 = PENDING
     */
    if (data.purchaseState !== 0) {
      throw new RpcException({
        status: 400,
        message: 'GOOGLE_PURCHASE_NOT_COMPLETED',
      });
    }

    // Prevent double spending
    if (await this.isGoogleTokenUsed(serverVerificationData)) {
      throw new RpcException({
        status: 409,
        message: 'GOOGLE_PURCHASE_ALREADY_USED',
      });
    }

    // Persist token BEFORE granting anything
    await this.storeGooglePurchase({
      purchaseToken: serverVerificationData,
      orderId: data.orderId,
      productId: storeProductId,
    });

    // Optional but recommended
    if (data.acknowledgementState === 0) {
      await this.acknowledgeGooglePurchase(
        packageName,
        storeProductId,
        serverVerificationData,
        accessToken.token,
      );
    }

    // YOUR BUSINESS LOGIC HERE
    return this.createPaidOrderAndGrantItems({
      externalOrderId: data.orderId,
      storeProductId,
      source: 'google_play',
    });
  }

  private async acknowledgeGooglePurchase(
    packageName: string,
    productId: string,
    token: string,
    accessToken: string,
  ) {
    const url =
      `https://androidpublisher.googleapis.com/androidpublisher/v3/applications/` +
      `${packageName}/purchases/products/${productId}/tokens/${token}:acknowledge`;

    await axios.post(
      url,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
  }

  // ============= APPLE APP STORE =============
  private async verifyApplePurchase(dto: VerifyInAppPurchaseDto) {
    const receipt = dto.serverVerificationData;

    const payload = {
      'receipt-data': receipt,
      password: process.env.APPLE_SHARED_SECRET,
      'exclude-old-transactions': true,
    };

    let response = await axios.post(
      'https://buy.itunes.apple.com/verifyReceipt',
      payload,
    );

    // Sandbox receipt sent to production
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

    const transactionId = receiptInfo.transaction_id;

    if (await this.isAppleTransactionUsed(transactionId)) {
      throw new RpcException({
        status: 409,
        message: 'APPLE_TRANSACTION_ALREADY_USED',
      });
    }

    await this.storeApplePurchase({
      transactionId,
      productId: receiptInfo.product_id,
      originalTransactionId: receiptInfo.original_transaction_id,
    });

    // YOUR BUSINESS LOGIC HERE
    return this.createPaidOrderAndGrantItems({
      externalOrderId: transactionId,
      storeProductId: receiptInfo.product_id,
      source: 'app_store',
    });
  }

  // ============= STORAGE =============
  private async isGoogleTokenUsed(token: string): Promise<boolean> {
    // TODO: query DB table google_purchases
    return false;
  }

  private async storeGooglePurchase(data: {
    purchaseToken: string;
    orderId: string;
    productId: string;
  }) {
    // TODO: insert into google_purchases table
  }

  private async isAppleTransactionUsed(
    transactionId: string,
  ): Promise<boolean> {
    // TODO: query DB table apple_purchases
    return false;
  }

  private async storeApplePurchase(data: {
    transactionId: string;
    productId: string;
    originalTransactionId?: string;
  }) {
    // TODO: insert into apple_purchases table
  }

  // TODO: generate paid order
  private async createPaidOrderAndGrantItems(data: {
    externalOrderId: string;
    storeProductId: string;
    source: 'google_play' | 'app_store';
  }) {
    /**
     * 1. Validate item exists
     * 2. Prevent lifetime re-purchase
     * 3. Create PAID order
     * 4. Grant points / unlock levels
     * 5. Emit notification
     */
    return {
      success: true,
      ...data,
    };
  }
}
