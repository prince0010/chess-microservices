import { Controller, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { NATS_SERVICE } from 'src/config';

@Controller('payment')
export class PaymentController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  // not used at the moment
}
