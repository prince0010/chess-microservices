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
  const module = await eval(`import('jose')`);
  // If the module has a 'default' property, use it, otherwise use the module itself
  return module.default ? module.default : module;
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
      const APPLE_BUNDLE_ID = envs.appleBundleId;

      // Decode the JWS token sent by Flutter - the serverVerificationData IS the JWS string
      // const decoded: any = jose.decodeJwt(dto.serverVerificationData);
      /*
        {
          transactionId: '2000001085307874',
          originalTransactionId: '2000001085307874',
          bundleId: 'com.wechess.app',
          productId: 'com.wechess.unlock.lifetime',
          purchaseDate: 1766038941000,
          originalPurchaseDate: 1766038941000,
          quantity: 1,
          type: 'Non-Consumable',
          deviceVerification: 'zUxWL49n3ewoDEak2RjNKxWIkV3QC9pZi3K45xyU0x59yBhGS7htloVGRhWf5rUk',
          deviceVerificationNonce: 'a8d3648e-4020-4782-91a1-eac6832a9112',
          inAppOwnershipType: 'PURCHASED',
          signedDate: 1766073401246,
          environment: 'Sandbox',
          transactionReason: 'PURCHASE',
          storefront: 'CRI',
          storefrontId: '143495',
          price: 74900,
          currency: 'USD',
          appTransactionId: '705117304493438845'
        }
      */

      // 1. Verify JWS signature
      const { payload }: any = await jose.jwtVerify(
        dto.serverVerificationData,
        async (header) => {
          if (!header.x5c?.length) {
            throw new RpcException({
              status: 400,
              message: 'APPLE_JWS_MISSING_CERT',
            });
          }

          return jose.importX509(
            `-----BEGIN CERTIFICATE-----\n${header.x5c[0]}\n-----END CERTIFICATE-----`,
            'ES256',
          );
        },
      );

      // 2. Validate transaction identifiers
      if (!payload.originalTransactionId) {
        throw new RpcException({
          status: 400,
          message: 'APPLE_JWS_INVALID_PAYLOAD',
        });
      }

      // 3. Bundle validation
      if (payload.bundleId !== APPLE_BUNDLE_ID) {
        throw new RpcException({
          status: 403,
          message: 'BUNDLE_ID_MISMATCH',
        });
      }

      // 4. Product validation
      if (payload.productId !== dto.storeProductId) {
        throw new RpcException({
          status: 400,
          message: 'PRODUCT_ID_MISMATCH',
        });
      }

      // 5. Ownership validation
      if (payload.inAppOwnershipType !== 'PURCHASED') {
        throw new RpcException({
          status: 400,
          message: 'NOT_PURCHASED',
        });
      }

      // ✅ Verified purchase — create order
      return await this.createPaidOrder({
        userUid: dto.userUid,
        storeChargeId: payload.originalTransactionId ?? payload.transactionId,
        storeProductId: payload.productId,
        source: StorePlatform.APPLE_APP_STORE,
        rawReceipt: payload,
      });
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message || 'APPLE_VERIFICATION_FAILED',
      });
    }
  }

  // in case in future is needed generate JWT to use APPLE APP STORE CONNECT API
  // private async generateAppleAdminToken(jose: any) {
  //   const APPLE_KEY_ID = envs.appleKeyId;
  //   const APPLE_ISSUER_ID = envs.appleIssuerId;
  //   const APPLE_BUNDLE_ID = envs.appleBundleId;

  //   const privateKeyString = envs.applePrivateKey.replace(/\\n/g, '\n');
  //   const ecPrivateKey = await jose.importPKCS8(privateKeyString, 'ES256');

  //   return new jose.SignJWT({ bid: APPLE_BUNDLE_ID })
  //     .setProtectedHeader({
  //       alg: 'ES256',
  //       kid: APPLE_KEY_ID,
  //       typ: 'JWT',
  //     })
  //     .setIssuer(APPLE_ISSUER_ID)
  //     .setIssuedAt()
  //     .setExpirationTime('5m') // Token lasts 5 minutes
  //     .setAudience('appstoreconnect-v1')
  //     .sign(ecPrivateKey);
  // }

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
