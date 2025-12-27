import axios from 'axios';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { GoogleAuth } from 'google-auth-library';
import { firstValueFrom } from 'rxjs';
import { Repository } from 'typeorm';

import { envs, NATS_SERVICE } from 'src/config';
import { Item } from '../item/entities/item.entity';
import { Order } from './entities/order.entity';
import { OrderService } from './order.service';

import { InAppPurchaseRequestDto, PaidOrderAppDto } from './dto';
import {
  IapStoreProductId,
  OrderStatus,
  OrderVerificationStatus,
  StorePlatform,
} from 'src/enum';
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
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async newRequest(
    dto: InAppPurchaseRequestDto,
  ): Promise<IPaymentInAppPurchaseResponse> {
    const { storeProductId, serverVerificationData, userUid } = dto;
    const packageName = envs.androidPackageName;

    // TODO: tell me what is come from on google flutter object when customer device send me this and the typo of this object
    console.log({ serverVerificationData });

    try {
      const authClient = await this.googleAuth.getClient();
      console.log(1);
      const accessToken = await authClient.getAccessToken();
      console.log(2);

      const url =
        `https://androidpublisher.googleapis.com/androidpublisher/v3/applications/` +
        `${packageName}/purchases/products/${storeProductId}/tokens/${serverVerificationData}`;

      console.log({ url });
      const { data } = await axios.get(url, {
        headers: { Authorization: `Bearer ${accessToken.token}` },
      });

      console.log({ data });
      // TODO: tell me which properties comes in data
      /*
        data = {
          purchaseState: number,
          acknowledgementState: number,
          ... what else ??
        }
      */

      const orderId = data.obfuscatedExternalAccountId; // changeMe!

      if (data.purchaseState !== 0) {
        throw new BadRequestException('GOOGLE_PURCHASE_NOT_COMPLETED');
      }

      console.log(3);

      // Acknowledge (mandatory)
      if (data.acknowledgementState === 0) {
        await axios.post(
          `${url}:acknowledge`,
          {},
          { headers: { Authorization: `Bearer ${accessToken.token}` } },
        );
      }

      console.log(4);

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

      console.log(5);

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

      console.log(6);
      const order = await this.orderService.findOne(orderId);

      if (order.storeChargeId && order.status !== OrderStatus.PENDING) {
        return {
          success: true,
          orderId: order.id,
          item,
          alreadyProcessed: true,
        };
      }

      console.log(7);

      return await this.updateOrder(dto, item, data);
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message || 'APPLE_VERIFICATION_FAILED',
      });
    }
  }

  private async updateOrder(
    dto: any, // changeMe! when we know google request object
    item: Item,
    payload: any,
  ): Promise<IPaymentInAppPurchaseResponse> {
    try {
      // on this point update order with storeChargeId
      await this.orderRepository.update(
        { id: dto.orderId },
        {
          storeChargeId: payload.orderId, // "GPA.XXXX-XXXX-XXXX"
          verificationStatus: OrderVerificationStatus.VERIFIED_SERVER_SIDE, // on goggle it is verified always on server side with the googleServiceAccountJson
        },
      );

      // mark order as paid
      const dtoPaidOrder: PaidOrderAppDto = {
        orderId: dto.orderId,
        source: StorePlatform.GOOGLE_PLAY_STORE,
        rawReceipt: payload,
      };
      await this.orderService.markOrderAppAsPaid(dtoPaidOrder);

      return {
        success: true,
        orderId: dto.orderId,
        item,
        alreadyProcessed: false,
      };
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }
}
