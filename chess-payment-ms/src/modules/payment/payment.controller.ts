import { Controller, Post, Req, Res } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Request, Response } from 'express';

import { PaymentService } from './payment.service';

import { PaymentSessionDto } from './dto/payment-session.dto';
import { PaymentAppleService } from './payment-apple.service';

@Controller('payment')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly paymentAppleService: PaymentAppleService,
  ) {}

  // called from Order Service after generate new order with status pending
  @MessagePattern('payment.create.session')
  createPaymentSession(@Payload() paymentSessionDto: PaymentSessionDto) {
    return this.paymentService.createPaymentSession(paymentSessionDto);
  }

  /*
    On localhost use CLI to activate stripe events with this command: stripe listen --forward-to localhost:3004/payment/webhook
  */
  // stripe events
  // @Post('webhook')
  // async stripeWebhook(@Req() req: Request, @Res() res: Response) {
  //   return this.paymentService.stripeWebhook(req, res);
  // }

  // apple notification v2 - production
  // url: https://we-chess.com/payment/webhook/apple-production-webhook
  @Post('webhook/apple-production-webhook')
  async appleWebhook(@Req() req: Request, @Res() res: Response) {
    return this.paymentAppleService.notification(req, res);
  }

  // apple notification v2 - sandbox
  // url: https://test-we-chess.com/payment/webhook/apple-sandbox-webhook
  @Post('webhook/apple-sandbox-webhook')
  async appleSandboxWebhook(@Req() req: Request, @Res() res: Response) {
    return this.paymentAppleService.notification(req, res);
  }
}
