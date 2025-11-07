import { Controller, Inject, Post, Req, Res } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Request, Response } from 'express';

import { NATS_SERVICE } from 'src/config';

@Controller('payment')
export class PaymentController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  // not used at the moment
}
