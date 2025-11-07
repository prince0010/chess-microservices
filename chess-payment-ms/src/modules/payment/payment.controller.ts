import { Controller, Post, Req, Res } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { Request, Response } from 'express';

import { PaymentService } from './payment.service';

import { PaymentSessionDto } from './dto/payment-session.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  // called from Order Service after generate new order with status pending
  @MessagePattern('payment.create.session')
  createPaymentSession(@Payload() paymentSessionDto: PaymentSessionDto) {
    return this.paymentService.createPaymentSession(paymentSessionDto);
  }

  // stripe events for localhost development with CLI
  @Post('webhook')
  async stripeWebhook(@Req() req: Request, @Res() res: Response) {
    return this.paymentService.stripeWebhook(req, res);
  }

  // Stripe events for production/test forwarded by Gateway via NATS
  @EventPattern('payment.listen.webhookStripe')
  stripeWebhookViaNATS(@Payload() payload: any) {
    // Reconstruct mock request & response objects for compatibility
    const mockReq: Partial<any> = {
      headers: payload.headers,
      rawBody: payload.rawBody,
    };

    const mockRes = {
      status: () => ({
        send: () => {},
        json: () => {},
      }),
    } as unknown as Partial<Response>;

    this.paymentService.stripeWebhook(mockReq as Request, mockRes as Response);
  }
}
