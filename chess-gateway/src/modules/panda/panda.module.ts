import { Module } from '@nestjs/common';

import { NatsModule } from '../transports/nats.module';
import { PandaController } from './panda.controller';

@Module({
  controllers: [PandaController],
  imports: [NatsModule],
})
export class PandaModule {}
