import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NatsModule } from '../transports/nats.module';
import { NotificationPurchaseModule } from '../notification/notification-purchase.module';
import { ItemModule } from '../item/item.module';

import { OrdersController } from './order.controller';
import { OrderService } from './order.service';

import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { OrderReceipt } from './entities/order-receipt.entity';

@Module({
  controllers: [OrdersController],
  providers: [OrderService],
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, OrderReceipt]),
    NatsModule,
    ItemModule,
    NotificationPurchaseModule,
  ],
  exports: [TypeOrmModule],
})
export class OrderModule {}
