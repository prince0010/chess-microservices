import { Controller, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  // stripe events will notify this endpoint in testing and production environment
  @Post('webhook')
  async stripeWebhook(@Req() req: Request, @Res() res: Response) {
    return this.paymentService.stripeWebhook(req, res);
  }
}
