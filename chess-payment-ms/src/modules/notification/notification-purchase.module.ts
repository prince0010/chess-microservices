import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NatsModule } from '../transports/nats.module';

import { NotificationPurchaseController } from './notification-purchase.controller';
import { NotificationPurchaseService } from './notification-purchase.service';

import { NotificationPurchase } from './entities/notification-purchase.entity';

@Module({
  controllers: [NotificationPurchaseController],
  providers: [NotificationPurchaseService],
  imports: [TypeOrmModule.forFeature([NotificationPurchase]), NatsModule],
  exports: [TypeOrmModule, NotificationPurchaseService],
})
export class NotificationPurchaseModule {}
