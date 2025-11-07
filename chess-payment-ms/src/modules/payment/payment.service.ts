import { Request, Response } from 'express';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import Stripe from 'stripe';

import { envs, NATS_SERVICE } from 'src/config';

import { PaymentSessionDto } from './dto/payment-session.dto';
import { IPaymentSessionResponse } from 'src/interfaces';

@Injectable()
export class PaymentService {
  private readonly stripe = new Stripe(envs.stripeSecretApiKey);

  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  async createPaymentSession(
    paymentSessionDto: PaymentSessionDto,
  ): Promise<IPaymentSessionResponse> {
    const { currency, items, orderId } = paymentSessionDto;

    const lineItems = items.map((item) => ({
      price_data: {
        currency: currency,
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    }));

    const session = await this.stripe.checkout.sessions.create({
      // set here the order id
      payment_intent_data: {
        metadata: {
          orderId: orderId,
        },
      },
      line_items: lineItems,
      mode: 'payment',
      success_url: envs.stripeSuccessUrl,
      cancel_url: envs.stripeCancelUrl,
    });

    return {
      cancelUrl: session.cancel_url,
      successUrl: session.success_url,
      url: session.url,
    };
  }

  // stripe notifications due to their events
  public async stripeWebhook(req: Request, res: Response) {
    const signature = req.headers['stripe-signature'];

    let event: Stripe.Event;
    const endpointSecret = envs.stripeEndpointSecret;

    try {
      event = this.stripe.webhooks.constructEvent(
        req['rawBody'],
        signature,
        endpointSecret,
      );
    } catch (error) {
      return res.status(400).send(`Webhook error: ${error.message}`);
    }

    switch (event.type) {
      case 'charge.succeeded':
        console.log('Payemnt sucess stripe event received');
        const chargeSucceeded = event.data.object;
        const payload = {
          stripePaymentId: chargeSucceeded.id,
          orderId: chargeSucceeded.metadata.orderId,
          receiptUrl: chargeSucceeded.receipt_url,
        };

        // On this point notify to order that payment was successful
        this.client.emit('order.payment.succeeded', payload);
        break;
      case 'charge.failed':
        const failedPayment = event.data.object;
        const failedPayload = {
          stripePaymentId: failedPayment.id,
          orderId: failedPayment.metadata?.orderId,
          receiptUrl: null,
        };

        // On this point notify to order that payment failed
        this.client.emit('order.payment.failed', failedPayload);
        break;
      case 'payment_method.attached':
        const paymentMethod = event.data.object;
        // handlePaymentMethodAttached(paymentMethod);
        break;

      default:
        // console.warn(`Stripe Event type: ${event.type} not handled`);
        break;
    }

    return res.status(200).json({ signature });
  }
}
