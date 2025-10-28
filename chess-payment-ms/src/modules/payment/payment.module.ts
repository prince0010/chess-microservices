import { Module } from '@nestjs/common';

import { NatsModule } from '../transports/nats.module';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';

@Module({
  controllers: [PaymentController],
  providers: [PaymentService],
  imports: [NatsModule],
})
export class PaymentModule {}
