// import * as jose from 'jose';
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

const loadJose = async () => {
  // We use eval('import(...)') so the TS compiler doesn't turn it into require()
  return eval(`import('jose')`) as Promise<typeof import('jose')>;
};

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
    try {
      const jose = await loadJose();

      // 1. Decode the JWS token sent by Flutter - the serverVerificationData IS the JWS string
      const decoded: any = jose.decodeJwt(dto.serverVerificationData);

      // 2. Validate the data from the decoded payload - Apple JWS payload fields: 'transactionId', 'productId', etc.
      if (!decoded || !decoded.transactionId) {
        throw new RpcException({
          status: 400,
          message: 'APPLE_JWS_INVALID_PAYLOAD',
        });
      }
      const transactionId = decoded.transactionId;

      const adminToken = await this.generateAppleAdminToken(jose);
      const url = `${envs.appleBaseUrlApi}/inApps/v1/transactions/${transactionId}`;
      const appleBundleId = envs.appleBundleId;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });

      // Apple returns a SIGNED JWS. We decode the verified response.
      const signedTransaction = response.data.signedTransactionInfo;
      const verifiedData: any = jose.decodeJwt(signedTransaction);

      // Final Verification Logic
      if (verifiedData.bundleId !== appleBundleId) {
        throw new RpcException({ status: 403, message: 'BUNDLE_ID_MISMATCH' });
      }

      if (verifiedData.productId !== dto.storeProductId) {
        throw new RpcException({ status: 400, message: 'PRODUCT_ID_MISMATCH' });
      }

      // If it reaches here, it is a 100% verified purchase from Apple's own database
      return await this.createPaidOrder({
        userUid: dto.userUid,
        storeChargeId: verifiedData.transactionId,
        storeProductId: verifiedData.productId,
        source: StorePlatform.APPLE_APP_STORE,
        rawReceipt: verifiedData,
      });
    } catch (error) {
      console.error('Apple Verification Error:', error);
      throw new RpcException({
        status: 400,
        message: error.message || 'APPLE_VERIFICATION_FAILED',
      });
    }
  }

  private async generateAppleAdminToken(jose: any) {
    const APPLE_KEY_ID = envs.appleKeyId;
    const APPLE_ISSUER_ID = envs.appleIssuerId;
    const APPLE_BUNDLE_ID = envs.appleBundleId;

    const privateKeyString = envs.applePrivateKey.replace(/\\n/g, '\n');
    const ecPrivateKey = await jose.importPKCS8(privateKeyString, 'ES256');

    return new jose.SignJWT({})
      .setProtectedHeader({
        alg: 'ES256',
        kid: APPLE_KEY_ID,
        typ: 'JWT',
      })
      .setIssuer(APPLE_ISSUER_ID)
      .setIssuedAt()
      .setExpirationTime('5m') // Token lasts 5 minutes
      .setAudience('appstoreconnect-v1')
      .setPayload({ bid: APPLE_BUNDLE_ID })
      .sign(ecPrivateKey);
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
