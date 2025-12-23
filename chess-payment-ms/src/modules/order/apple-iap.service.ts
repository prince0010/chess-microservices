import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import { envs, NATS_SERVICE } from 'src/config';
import { OrderService } from './order.service';

import { CreateOrderAppDto, InAppPurchaseRequestDto } from './dto';
import { IapStoreProductId, StorePlatform } from 'src/enum';
import {
  IAppleIapClientSideRequest,
  IPaymentInAppPurchaseResponse,
} from 'src/interfaces';
import { Item } from '../item/entities/item.entity';

const loadJose = async () => {
  const module = await eval(`import('jose')`);
  // If the module has a 'default' property, use it, otherwise use the module itself
  return module.default ? module.default : module;
};

@Injectable()
export class AppleIapService {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
    private readonly orderService: OrderService,
  ) {}

  // Entry point from client side - mobile app
  async newRequest(
    dto: InAppPurchaseRequestDto,
  ): Promise<IPaymentInAppPurchaseResponse> {
    try {
      const jose = await loadJose();
      const APPLE_BUNDLE_ID = envs.appleBundleId;

      // 1. Verify and decode JWS signature
      const { payload: payloadDecoded } = await jose.jwtVerify(
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
      const payload: IAppleIapClientSideRequest = payloadDecoded;

      // 2. Verify if exists order and avoid duplicity
      const existingOrder = await this.orderService.findOneByStoreChargeId(
        payload.transactionId,
      );

      if (existingOrder) {
        return {
          success: true,
          orderId: existingOrder.id,
          item: existingOrder.orderItems[0].item,
          alreadyProcessed: true,
        };
      }

      // 3. Validate transaction identifiers
      if (!payload.transactionId || !payload.originalTransactionId) {
        return {
          success: false,
          orderId: null,
          item: null,
          errorMessage: 'APPLE_JWS_INVALID_ORIGINAL_TRANSACTION_ID',
          alreadyProcessed: false,
        };
      }

      // 4. Bundle validation
      if (payload.bundleId !== APPLE_BUNDLE_ID) {
        return {
          success: false,
          orderId: null,
          item: null,
          errorMessage: 'BUNDLE_ID_MISMATCH',
          alreadyProcessed: false,
        };
      }

      // 5. Product validation
      if (payload.productId !== dto.storeProductId) {
        return {
          success: false,
          orderId: null,
          item: null,
          errorMessage: 'PRODUCT_ID_MISMATCH',
          alreadyProcessed: false,
        };
      }

      // 6. Ownership validation
      if (payload.inAppOwnershipType !== 'PURCHASED') {
        return {
          success: false,
          orderId: null,
          item: null,
          errorMessage: 'IN_APP_OWNERSHIP_TYPE_NOT_PURCHASED',
          alreadyProcessed: false,
        };
      }

      // 7- verify itemId exists on database
      const item = await this.orderService.existItemId(payload.productId);

      if (!item) {
        return {
          success: false,
          orderId: null,
          item: null,
          errorMessage: 'ITEM_ID_NOT_FOUND',
          alreadyProcessed: false,
        };
      }

      // 8- avoid duplicate unlock levels for lifetime - non-consumable
      if (payload.productId === IapStoreProductId.UNLOCK_LIFETIME) {
        const subscriptionLifetime = await firstValueFrom(
          this.client.send(
            'paymentSubscription.levelsForLifeTime.active',
            dto.userUid,
          ),
        ).catch(() => false);

        if (subscriptionLifetime) {
          return {
            success: false,
            orderId: null,
            item: null,
            errorMessage: 'UNLOCK_ALL_LEVELS_FOR_LIFE_TIME_ALREADY_PURCHASED',
            alreadyProcessed: false,
          };
        }
      }

      return await this.createOrderAsPending(dto.userUid, item, payload);
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

  private async createOrderAsPending(
    userUid: number,
    item: Item,
    payload: IAppleIapClientSideRequest,
  ): Promise<IPaymentInAppPurchaseResponse> {
    try {
      const payloadNewOrder: CreateOrderAppDto = {
        storeChargeId: payload.transactionId,
        userUid,
        source: StorePlatform.APPLE_APP_STORE,
        items: [
          {
            itemId: item.id,
            quantity: 1,
          },
        ],
      };

      const { order, duplicatedOrder } =
        await this.orderService.create(payloadNewOrder);

      return {
        success: true,
        orderId: order.id,
        item: order.orderItems[0].item,
        alreadyProcessed: duplicatedOrder,
      };
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }
}
