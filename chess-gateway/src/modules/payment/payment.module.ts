import { Module } from '@nestjs/common';

import { NatsModule } from '../transports/nats.module';
import { PaymentController } from './payment.controller';
import { ItemController } from './item.controller';

@Module({
  controllers: [PaymentController, ItemController],
  providers: [],
  imports: [NatsModule],
})
export class PaymentModule {}
