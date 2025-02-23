import { Module } from '@nestjs/common';

import { HealthCheckModule } from './modules/health-check/health-check.module';
import { NatsModule } from './modules/transports/nats.module';

@Module({
  imports: [HealthCheckModule, NatsModule],
})
export class AppModule {}
