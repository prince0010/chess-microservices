import { Inject, Injectable } from '@nestjs/common';
import { CreateNotificationPurchaseDto } from './dto/create-notification-purchase.dto';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationPurchase } from './entities/notification-purchase.entity';
import { Repository } from 'typeorm';

@Injectable()
export class NotificationPurchaseService {
  constructor(
    // @Inject(NATS_SERVICE) private readonly client: ClientProxy,

    @InjectRepository(NotificationPurchase)
    private readonly notificationPurchaseRepository: Repository<NotificationPurchase>,
  ) {}

  async create(
    createNotificationPurchaseDto: CreateNotificationPurchaseDto,
  ): Promise<void> {
    const newNotification = this.notificationPurchaseRepository.create({
      ...createNotificationPurchaseDto,
    });

    await this.notificationPurchaseRepository.save(newNotification);
  }

  // this endpoint will be called many times from frontend poll
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

      return { notification: unreadNotification };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        status: 400,
      });
    }
  }
}
