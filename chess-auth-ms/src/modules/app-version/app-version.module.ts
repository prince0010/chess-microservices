import { Module } from '@nestjs/common';

import { NatsModule } from '../transports/nats.module';
import { AppVersionController } from './app-version.controller';
import { AppVersionService } from './app-version.service';

@Module({
  controllers: [AppVersionController],
  providers: [AppVersionService],
  imports: [NatsModule],
})
export class AppVersionModule {}
