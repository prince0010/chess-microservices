import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NatsModule } from 'src/modules/transports/nats.module';

import { AuthPanda } from './entities/auth-panda.entity';
import { PandaController } from './panda.controller';
import { PandaService } from './panda.service';

@Module({
  controllers: [PandaController],
  providers: [PandaService],
  imports: [TypeOrmModule.forFeature([AuthPanda]), NatsModule],
  exports: [TypeOrmModule],
})
export class PandaModule {}
