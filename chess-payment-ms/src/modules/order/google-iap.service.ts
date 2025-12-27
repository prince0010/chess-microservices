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
import {
  IGoogleIapClientSideRequest,
  IPaymentInAppPurchaseResponse,
} from 'src/interfaces';

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
    const { storeProductId, serverVerificationData } = dto;
    const packageName = envs.androidPackageName;
    const token = encodeURIComponent(serverVerificationData);

    try {
      const authClient = await this.googleAuth.getClient();
      const accessToken = await authClient.getAccessToken();

      const url = `https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${packageName}/purchases/products/${storeProductId}/tokens/${token}`;

      const { data: payloadData } = await axios.get(url, {
        headers: { Authorization: `Bearer ${accessToken.token}` },
      });

      const data: IGoogleIapClientSideRequest = payloadData;
      const orderUUID = data.obfuscatedExternalAccountId;

      if (data.purchaseState !== 0) {
        throw new BadRequestException('GOOGLE_PURCHASE_NOT_COMPLETED');
      }

      // Acknowledge google (mandatory)
      if (data.acknowledgementState === 0) {
        await axios.post(
          `${url}:acknowledge`,
          {},
          { headers: { Authorization: `Bearer ${accessToken.token}` } },
        );
      }

      // verify itemId exists on database
      const item = await this.orderService.existItemId(storeProductId);

      if (!item) {
        return {
          success: false,
          orderId: null,
          item: null,
          errorMessage: 'ITEM_ID_NOT_FOUND',
          alreadyProcessed: false,
        };
      }

      // avoid duplicate unlock levels for lifetime - non-consumable
      if (storeProductId === IapStoreProductId.UNLOCK_LIFETIME) {
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

      const order = await this.orderService.findOne(orderUUID);
      if (order.storeChargeId && order.status !== OrderStatus.PENDING) {
        return {
          success: true,
          orderId: order.id,
          item,
          alreadyProcessed: true,
        };
      }

      return await this.updateOrder(item, data);
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message || 'APPLE_VERIFICATION_FAILED',
      });
    }
  }

  private async updateOrder(
    item: Item,
    payload: IGoogleIapClientSideRequest,
  ): Promise<IPaymentInAppPurchaseResponse> {
    const orderUUID = payload.obfuscatedExternalAccountId;

    try {
      // on this point update order with storeChargeId
      await this.orderRepository.update(
        { id: orderUUID },
        {
          storeChargeId: payload.orderId, // "GPA.XXXX-XXXX-XXXX"
          verificationStatus: OrderVerificationStatus.VERIFIED_SERVER_SIDE, // on goggle it is verified always on server side with the googleServiceAccountJson
        },
      );

      // mark order as paid
      const dtoPaidOrder: PaidOrderAppDto = {
        orderId: orderUUID,
        source: StorePlatform.GOOGLE_PLAY_STORE,
        rawReceipt: payload,
      };
      await this.orderService.markOrderAppAsPaid(dtoPaidOrder);

      return {
        success: true,
        orderId: orderUUID,
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
