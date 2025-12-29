import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationPurchase } from './entities/notification-purchase.entity';
import { Order } from '../order/entities/order.entity';

import { CreateNotificationPurchaseDto } from './dto/create-notification-purchase.dto';
import { FindNotificationPurchaseByOrderDto } from './dto/find-notification-purchase-by-order.dto';
import { NotificationDestination } from 'src/enum';

@Injectable()
export class NotificationPurchaseService {
  constructor(
    // @Inject(NATS_SERVICE) private readonly client: ClientProxy,

    @InjectRepository(NotificationPurchase)
    private readonly notificationPurchaseRepository: Repository<NotificationPurchase>,

    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async create(dto: CreateNotificationPurchaseDto): Promise<void> {
    const newNotification = this.notificationPurchaseRepository.create({
      ...dto,
      isRead: dto.destination === NotificationDestination.APP, // change this when app requires create inbox notifications list on flutter app
    });

    await this.notificationPurchaseRepository.save(newNotification);
  }

  // this endpoint will be called many times from website poll
  // requests to know when a payment session by stripe hook was caught
  async findOne(userUid: number) {
    try {
      const unreadNotification =
        await this.notificationPurchaseRepository.findOne({
          where: { isRead: false, userUid },
        });

      if (!unreadNotification) {
        return { notification: null };
      }

      await this.notificationPurchaseRepository.update(
        { id: unreadNotification.id },
        { isRead: true },
      );

      // add order to notification
      const orderWithItems = await this.orderRepository.findOne({
        where: { id: unreadNotification.orderId },
        relations: { orderItems: { item: true } },
      });

      // important to add order with orderItems and with items relation
      const notificationResponse = {
        ...unreadNotification,
        order: orderWithItems,
      };

      return { notification: notificationResponse };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        status: 400,
      });
    }
  }

  async findOneByOrderId(dto: FindNotificationPurchaseByOrderDto) {
    const { userUid, orderId } = dto;

    try {
      const notification = await this.notificationPurchaseRepository.findOne({
        where: { userUid, orderId },
      });

      if (!notification) {
        return { notification: null };
      }

      // add order to notification
      const orderWithItems = await this.orderRepository.findOne({
        where: { id: orderId },
        relations: { orderItems: { item: true } },
      });

      const notificationResponse = {
        ...notification,
        order: orderWithItems,
      };

      return { notification: notificationResponse };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        status: 400,
      });
    }
  }
}
