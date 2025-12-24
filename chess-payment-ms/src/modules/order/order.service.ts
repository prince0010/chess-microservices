import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { firstValueFrom } from 'rxjs';

import { NATS_SERVICE } from 'src/config';
import { Order } from './entities/order.entity';
import { Item } from '../item/entities/item.entity';
import { OrderReceipt } from './entities/order-receipt.entity';
import { PaymentSubscription } from '../payment-subscription/entities/payment-subscription.entity';

import { ItemService } from '../item/item.service';
import { NotificationPurchaseService } from '../notification/notification-purchase.service';

import {
  FailedOrderAppDto,
  OrderAppPaginationDto,
  PaidOrderAppDto,
  PlayerGoToCheckoutDto,
  UpdateUserPointsAfterPurchaseDto,
} from './dto';
import { CreateNotificationPurchaseDto } from '../notification/dto/create-notification-purchase.dto';
import { AppleTransactionInfoV2, IListOrders } from 'src/interfaces';
import {
  ItemPackage,
  NotificationDestination,
  NotificationPurchaseMessage,
  NotificationPurchaseTitle,
  NotificationPurchaseType,
  OrderStatus,
  StorePlatform,
} from 'src/enum';

@Injectable()
export class OrderService {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,

    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderReceipt)
    private readonly orderReceiptRepository: Repository<OrderReceipt>,
    @InjectRepository(PaymentSubscription)
    private readonly paymentSubscriptionRepository: Repository<PaymentSubscription>,

    private readonly itemService: ItemService,
    private readonly notificationPurchaseService: NotificationPurchaseService,
  ) {}

  async generateOrderToUseIap(dto: PlayerGoToCheckoutDto): Promise<Order> {
    const { itemId, userUid, source } = dto;

    try {
      const itemsResponse = await this.itemService.validateItems([itemId]);
      const item = itemsResponse[0];

      if (item.name === ItemPackage.OPEN_ALL_LEVELS_FOR_LIFE_TIME) {
        const { response: hasLifetime } =
          await this.existPurchaseUnlockLevelsForLifeTime(userUid);

        if (hasLifetime) {
          // User already purchased lifetime access => skip creating a new order
          throw new BadRequestException(
            'ALREADY_PACKAGE_ALL_LEVELS_UNLOCKED_PURCHASED',
          );
        }
      }

      const totalAmount = item.price * 1; // quantity is 1 for go to checkout
      const orderItems: any[] = [
        {
          price: item.price,
          quantity: 1,
          item,
        },
      ];

      const newOrder = this.orderRepository.create({
        storeChargeId: null, // at this point we don't have store charge id yet
        totalAmount,
        totalItems: 1,
        status: OrderStatus.PENDING,
        userUid,
        source,
        orderItems,
      });

      console.log('New order with status pending created');

      return await this.orderRepository.save(newOrder);
    } catch (error) {
      throw new RpcException({
        message: error.message,
        status: 400,
      });
    }
  }

  async existPurchaseUnlockLevelsForLifeTime(
    userUid: number,
  ): Promise<{ response: boolean }> {
    const hasLifetime = await firstValueFrom(
      this.client.send('paymentSubscription.levelsForLifeTime.active', userUid),
    );

    return { response: hasLifetime };
  }

  async findAll(
    orderPaginationDto: OrderAppPaginationDto,
  ): Promise<IListOrders> {
    const { limit = 12, page = 1, status = null } = orderPaginationDto;

    const offset = (page - 1) * limit;

    const findOptions: FindManyOptions<Order> = {
      where: {},
      take: limit,
      skip: offset,
      order: {
        id: 'ASC',
      },
    };

    const whereConditions: any = {};
    if (status) {
      whereConditions.status = status;
    }

    if (Object.keys(whereConditions).length > 0) {
      findOptions.where = whereConditions;
    }

    try {
      const [orders, total] = await this.orderRepository.findAndCount({
        ...findOptions,
      });

      return {
        currentPage: page,
        total,
        orders,
      };
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  async findOne(id: string): Promise<Order> {
    try {
      const order = await this.orderRepository.findOne({
        where: { id },
        relations: { orderItems: { item: true }, receipt: true },
      });

      if (!order) {
        throw new BadRequestException(`Order with UUID: ${id} not found.`);
      }

      return order;
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  async findOneByStoreChargeId(storeChargeId: string): Promise<Order | null> {
    try {
      const order = await this.orderRepository.findOne({
        where: { storeChargeId },
        relations: { orderItems: { item: true }, receipt: true },
      });

      if (!order) {
        return null;
      }

      return order;
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  async markOrderAppAsFailed(dto: FailedOrderAppDto): Promise<void> {
    const { orderId } = dto;

    const order = await this.findOne(orderId);

    // Update order
    order.status = OrderStatus.CANCELLED;

    await this.orderRepository.save(order);

    // maybe in future is needed to create notification payment failed
    // const dataNotification: CreateNotificationPurchaseDto = {
    //   userUid: order.userUid,
    //   type: NotificationPurchaseType.PAYMENT_FAILED,
    //   title: NotificationPurchaseTitle.PAYMENT_FAILED_TITLE,
    //   message: NotificationPurchaseMessage.PAYMENT_FAILED_MESSAGE,
    //   orderId: order.id,
    // };

    // await this.notificationPurchaseService.create(dataNotification);
  }

  async applePaymentNotificationReceived(data: AppleTransactionInfoV2) {
    const { appAccountToken } = data;

    const order = await this.findOne(appAccountToken);

    if (!order) {
      console.error(`Order with UUID: ${appAccountToken} not found.`);

      return;
    }

    if (order.status === OrderStatus.PAID) {
      return; // already processed, OK
    }

    if (order.status !== OrderStatus.PENDING) {
      console.error(
        `Order with UUID: ${appAccountToken} has not pending status.`,
      );

      return;
    }

    const paidOrderDto: PaidOrderAppDto = {
      orderId: order.id,
      source: StorePlatform.APPLE_APP_STORE,
      rawReceipt: data,
    };

    await this.markOrderAppAsPaid(paidOrderDto, order);
  }

  async markOrderAppAsPaid(dto: PaidOrderAppDto, order: Order): Promise<void> {
    const { orderId, source, rawReceipt } = dto;
    console.log(11);
    const newOrderReceipt = this.orderReceiptRepository.create({
      rawReceipt,
      source,
      // order,
    });

    // Save receipt first
    // await this.orderReceiptRepository.save(newOrderReceipt);
    console.log(12);
    // Update order
    order.status = OrderStatus.PAID;
    order.receipt = newOrderReceipt;
    order.paid = true;
    order.paidAt = new Date();
    order.storeChargeId = rawReceipt.transactionId;

    const savedOrder = await this.orderRepository.save(order);
    console.log(13);
    // apply action depend on payment order item
    for (const orderItem of savedOrder.orderItems) {
      switch (orderItem.item.name) {
        case ItemPackage.ONE_MILLION_PANDA_POINTS:
          console.log('ONE_MILLION_PANDA_POINTS');
          await this.addOneMillionPandaPoints(order);
          break;
        case ItemPackage.OPEN_ALL_LEVELS_FOR_30_DAYS:
          console.log('OPEN_ALL_LEVELS_FOR_30_DAYS');
          await this.createSubscriptionForLevelsOpenFor30Days(order);
          break;
        case ItemPackage.OPEN_ALL_LEVELS_FOR_LIFE_TIME:
          console.log('OPEN_ALL_LEVELS_FOR_LIFE_TIME');
          await this.createSubscriptionForLevelsOpenForLifeTime(order);
          break;

        default:
          break;
      }
    }
  }

  async existItemId(storeProductId: string): Promise<Item | null> {
    const item: Item = await firstValueFrom(
      this.client.send('item.find.storeProductId', storeProductId),
    );

    if (!item) {
      return null;
    }

    return item;
  }

  /* ====== APPLY REWARDS ======= */
  private async addOneMillionPandaPoints(order: Order): Promise<void> {
    const payload: UpdateUserPointsAfterPurchaseDto = {
      uid: order.userUid,
      points: 1000000,
    };
    await firstValueFrom(this.client.send('update.points.user', payload));

    // create notification payment succeed for 1M panda points added
    const dataNotification: CreateNotificationPurchaseDto = {
      userUid: order.userUid,
      destination: NotificationDestination.APP,
      type: NotificationPurchaseType.PAYMENT_SUCCESS,
      title: NotificationPurchaseTitle.PAYMENT_RECEIVED_TITLE,
      message:
        NotificationPurchaseMessage.ONE_MILLION_PANDA_POINTS_ADDED_MESSAGE,
      orderId: order.id,
    };

    await this.notificationPurchaseService.create(dataNotification);
  }

  private async createSubscriptionForLevelsOpenFor30Days(
    order: Order,
  ): Promise<void> {
    const now = new Date();

    const orderItem = order.orderItems.find(
      (i) => i.item.name === ItemPackage.OPEN_ALL_LEVELS_FOR_30_DAYS,
    );
    if (!orderItem) return;

    // create notification payment succeed all levels open for 30 days
    const dataNotificationFor30Days: CreateNotificationPurchaseDto = {
      userUid: order.userUid,
      destination: NotificationDestination.APP,
      type: NotificationPurchaseType.PAYMENT_SUCCESS,
      title: NotificationPurchaseTitle.PAYMENT_RECEIVED_TITLE,
      message: NotificationPurchaseMessage.ALL_LEVELS_OPEN_FOR_30_DAYS_MESSAGE,
      orderId: order.id,
    };

    await this.notificationPurchaseService.create(dataNotificationFor30Days);
    console.log('Notification created');

    // Fetch all existing subscriptions for this user & package
    const existingSubscriptions = await this.paymentSubscriptionRepository.find(
      {
        where: {
          userUid: order.userUid,
          item: { name: ItemPackage.OPEN_ALL_LEVELS_FOR_30_DAYS },
        },
        relations: { item: true },
        order: { expiresAt: 'DESC' },
      },
    );

    const durationDays = orderItem.item.durationDays;

    // Case 1: User has at least one active subscription → extend the most recent one
    const activeSubscription = existingSubscriptions.find(
      (sub) => sub.expiresAt > now,
    );

    if (activeSubscription) {
      const newExpiresAt = new Date(activeSubscription.expiresAt);
      newExpiresAt.setDate(newExpiresAt.getDate() + durationDays);

      activeSubscription.expiresAt = newExpiresAt;
      await this.paymentSubscriptionRepository.save(activeSubscription);

      return;
    }

    // Case 2: No active subscription → create a new one
    const newSubscription = this.paymentSubscriptionRepository.create({
      userUid: order.userUid,
      durationDays,
      item: orderItem.item,
      startedAt: now,
      expiresAt: new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000),
    });

    await this.paymentSubscriptionRepository.save(newSubscription);
    console.log('Subscription generated');
  }

  private async createSubscriptionForLevelsOpenForLifeTime(
    order: Order,
  ): Promise<void> {
    const now = new Date();

    const orderItem = order.orderItems.find(
      (i) => i.item.name === ItemPackage.OPEN_ALL_LEVELS_FOR_LIFE_TIME,
    );
    if (!orderItem) return;

    // Check if the user already has a lifetime subscription
    const existingLifetime = await this.paymentSubscriptionRepository.findOne({
      where: {
        userUid: order.userUid,
        item: { name: ItemPackage.OPEN_ALL_LEVELS_FOR_LIFE_TIME },
      },
      relations: { item: true },
    });

    if (existingLifetime) {
      return;
    }

    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 100); // +100 years

    // Create a new lifetime subscription (no expiration)
    const newSubscription = this.paymentSubscriptionRepository.create({
      userUid: order.userUid,
      durationDays: orderItem.item.durationDays,
      item: orderItem.item,
      startedAt: now,
      expiresAt,
    });

    await this.paymentSubscriptionRepository.save(newSubscription);

    // create notification payment succeed for all levels unlocked for life time
    const dataNotificationForLifeTime: CreateNotificationPurchaseDto = {
      userUid: order.userUid,
      destination: NotificationDestination.APP,
      type: NotificationPurchaseType.PAYMENT_SUCCESS,
      title: NotificationPurchaseTitle.PAYMENT_RECEIVED_TITLE,
      message:
        NotificationPurchaseMessage.ALL_LEVELS_OPEN_FOR_LIFE_TIME_MESSAGE,
      orderId: order.id,
    };

    await this.notificationPurchaseService.create(dataNotificationForLifeTime);
  }
}
