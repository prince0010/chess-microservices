import { Request, Response } from 'express';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { envs, NATS_SERVICE } from 'src/config';
import {
  AppleServerNotificationV2,
  AppleTransactionInfoV2,
} from 'src/interfaces';

const loadJose = async () => {
  const module = await eval(`import('jose')`);
  // If the module has a 'default' property, use it, otherwise use the module itself
  return module.default ? module.default : module;
};

@Injectable()
export class PaymentAppleService {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  public async notification(req: Request, res: Response) {
    try {
      const { signedPayload } = req.body;

      if (!signedPayload) {
        console.error('Missing signedPayload');
        return res.status(400).send('Missing signedPayload');
      }

      await this.processNotification(signedPayload);

      // Apple requires fast 200 OK
      return res.status(200).send('OK');
    } catch (error) {
      console.error('Apple notification error', error);
      return res.status(500).send('ERROR');
    }
  }

  async processNotification(signedPayload: string) {
    const jose = await loadJose();

    // 1. Verify outer notification
    const { payload } = await jose.jwtVerify(signedPayload, async (header) => {
      return jose.importX509(
        `-----BEGIN CERTIFICATE-----\n${header.x5c[0]}\n-----END CERTIFICATE-----`,
        'ES256',
      );
    });

    const notification = payload as AppleServerNotificationV2;

    // 2. Decode transaction info
    if (!notification.data?.signedTransactionInfo) {
      return;
    }

    const { payload: txPayload } = await jose.jwtVerify(
      notification.data.signedTransactionInfo,
      async (header) => {
        return jose.importX509(
          `-----BEGIN CERTIFICATE-----\n${header.x5c[0]}\n-----END CERTIFICATE-----`,
          'ES256',
        );
      },
    );

    const transaction = txPayload as AppleTransactionInfoV2;

    // ORDER UUID
    const orderUUID = transaction.appAccountToken;

    if (!orderUUID) {
      throw new Error('Missing appAccountToken');
    }

    // 3. Update order safely
    await this.handleTransaction(notification.notificationType, transaction);
  }

  async handleTransaction(type: string, tx: AppleTransactionInfoV2) {
    switch (type) {
      case 'ONE_TIME_CHARGE':
        // On this point notify to order that apple iap payment was successful
        this.client.emit('order.applePayment.notification', tx);
        break;
      case 'REFUND':
      case 'REVOKE':
        // revoke entitlement
        break;
      case 'CONSUMPTION_REQUEST':
        // respond if consumable was delivered
        break;
    }
  }
}
