import { Controller, Inject, Post, Req, Res } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Request, Response } from 'express';

import { NATS_SERVICE } from 'src/config';

@Controller('payment')
export class PaymentController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  // Production/Test — forward webhook to microservice
  @Post('webhook')
  async sendStripeWebhookToMicroservice(
    @Req() req: Request,
    @Res() res: Response,
  ) {
    // Send raw body + headers to microservice for signature verification
    this.client.emit('payment.listen.webhookStripe', {
      headers: req.headers,
      rawBody: req['rawBody'],
    });

    return res.status(200).send('Webhook sent to payment microservice');
  }
}
