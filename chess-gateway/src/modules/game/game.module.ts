import { Module } from '@nestjs/common';
import { NatsModule } from '../transports/nats.module';
import { GameController } from './game.controller';

@Module({
  controllers: [GameController],
  imports: [NatsModule],
})
export class GameModule {}
