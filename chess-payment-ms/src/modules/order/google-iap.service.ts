import axios from 'axios';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { GoogleAuth } from 'google-auth-library';
import { firstValueFrom } from 'rxjs';

import { envs, NATS_SERVICE } from 'src/config';
import { Item } from '../item/entities/item.entity';
import { OrderService } from './order.service';

import { CreateOrderAppDto, InAppPurchaseRequestDto } from './dto';
import { IapStoreProductId, StorePlatform } from 'src/enum';
import { IPaymentInAppPurchaseResponse } from 'src/interfaces';

const loadJose = async () => {
  const module = await eval(`import('jose')`);
  // If the module has a 'default' property, use it, otherwise use the module itself
  return module.default ? module.default : module;
};

@Injectable()
export class GoogleIapService {
  private googleAuth = new GoogleAuth({
    credentials: JSON.parse(envs.googleServiceAccountJson),
    scopes: ['https://www.googleapis.com/auth/androidpublisher'],
  });

  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
    private readonly orderService: OrderService,
  ) {}

  async newRequest(
    dto: InAppPurchaseRequestDto,
  ): Promise<IPaymentInAppPurchaseResponse> {
    const { storeProductId, serverVerificationData, userUid } = dto;
    const packageName = envs.androidPackageName;

    try {
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

      // 7- verify itemId exists on database
      const item = await this.orderService.existItemId(data.productId);

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
      if (data.productId === IapStoreProductId.UNLOCK_LIFETIME) {
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

      return await this.createOrderAsPending(dto.userUid, item, data);
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message || 'APPLE_VERIFICATION_FAILED',
      });
    }
  }

  private async createOrderAsPending(
    userUid: number,
    item: Item,
    payload: any, // changeMe! when we know google request object
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
