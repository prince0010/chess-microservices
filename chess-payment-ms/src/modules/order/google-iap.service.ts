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
    const token = encodeURIComponent(serverVerificationData);
    console.log({ token });

    // TODO: tell me what is come from on google flutter object when customer device send me this and the typo of this object
    console.log({ serverVerificationData });

    try {
      const authClient = await this.googleAuth.getClient();
      console.log({ authClient });
      console.log(1);
      const accessToken = await authClient.getAccessToken();
      console.log({ accessToken });
      console.log(2);

      const url1 =
        `https://androidpublisher.googleapis.com/androidpublisher/v3/applications/` +
        `${packageName}/purchases/products/${storeProductId}/tokens/${token}`;
      const url2 =
        `https://androidpublisher.googleapis.com/androidpublisher/v3/applications/` +
        `${packageName}/purchases/inapp/${storeProductId}/tokens/${token}`;

      let response;
      const urls = [
        `https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${packageName}/purchases/products/${storeProductId}/tokens/${token}`,
        `https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${packageName}/purchases/inapp/${storeProductId}/tokens/${token}`,
      ];

      // Try both URLs
      for (const targetUrl of urls) {
        try {
          const { data } = await axios.get(targetUrl, {
            headers: { Authorization: `Bearer ${accessToken.token}` },
          });
          response = { data, url: targetUrl };
          break; // Success! Exit loop
        } catch (err) {
          if (targetUrl === urls[urls.length - 1]) throw err; // If last URL fails, throw
          continue; // Try next URL
        }
      }

      const { data: payloadData, url } = response;
      const data: IGoogleIapClientSideRequest = payloadData;
      console.log(2.5);
      console.log({ data });
      // TODO: tell me which properties comes in data
      /*
        data = {
          purchaseState: number,
          acknowledgementState: number,
          ... what else ??
        }
      */

      const orderUUID = data.obfuscatedExternalAccountId; // changeMe!

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
      const order = await this.orderService.findOne(orderUUID);

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
      console.error(error);
      throw new RpcException({
        status: 400,
        message: error.message || 'APPLE_VERIFICATION_FAILED',
      });
    }
  }

  private async updateOrder(
    dto: InAppPurchaseRequestDto,
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
