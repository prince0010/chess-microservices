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
  CreateOrderAppDto,
  FailedOrderAppDto,
  OrderAppPaginationDto,
  PaidOrderAppDto,
  UpdateUserPointsAfterPurchaseDto,
} from './dto';
import { CreateNotificationPurchaseDto } from '../notification/dto/create-notification-purchase.dto';
import { IListOrders } from 'src/interfaces';
import {
  ItemPackage,
  NotificationDestination,
  NotificationPurchaseMessage,
  NotificationPurchaseTitle,
  NotificationPurchaseType,
  OrderStatus,
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

  // now this endpoint should be called from verify in app purchase
  async create(dto: CreateOrderAppDto): Promise<Order> {
    const { userUid, source, storeChargeId } = dto;
    try {
      // 1- validate items IDS exist on database
      const itemIds = dto.items.map((e) => e.itemId);
      const items = await this.itemService.validateItems(itemIds);

      // 2: Check for existing subscription => All levels unlocked for life time
      if (
        items.some(
          (item) => item.name === ItemPackage.OPEN_ALL_LEVELS_FOR_LIFE_TIME,
        )
      ) {
        const hasLifetime = await firstValueFrom(
          this.client.send(
            'paymentSubscription.levelsForLifeTime.active',
            userUid,
          ),
        );

        if (hasLifetime) {
          // User already purchased lifetime access => skip creating a new order
          throw new BadRequestException(
            'ALREADY_PACKAGE_ALL_LEVELS_UNLOCKED_PURCHASED',
          );
        }
      }

      // 3- calculate total price for each item * quantity (total)
      const totalAmount = dto.items.reduce((acc, orderItem) => {
        const price = items.find((e) => e.id === orderItem.itemId).price;

        return acc + price * orderItem.quantity;
      }, 0);

      // 4- calculate total items was bought
      const totalItems = dto.items.reduce((acc, orderItem) => {
        return acc + orderItem.quantity;
      }, 0);

      // 5- create orderItems
      const orderItems: any[] = items.map((item: Item) => ({
        price: item.price,
        quantity: dto.items.find((orderItem) => orderItem.itemId === item.id)
          .quantity,
        item,
      }));

      // 6- insert on database
      const newOrder = this.orderRepository.create({
        storeChargeId,
        totalAmount,
        totalItems: totalItems,
        userUid,
        source,
        orderItems,
      });

      const savedOrder = await this.orderRepository.save(newOrder);

      const orderWithItems = await this.orderRepository.findOne({
        where: { id: savedOrder.id },
        relations: { orderItems: { item: true } },
      });

      return orderWithItems;
    } catch (error) {
      throw new RpcException({
        message: error.message,
        status: 400,
      });
    }
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

  async markOrderAppAsPaid(dto: PaidOrderAppDto, order: Order): Promise<void> {
    const { orderId, source, rawReceipt } = dto;

    const newOrderReceipt = this.orderReceiptRepository.create({
      rawReceipt,
      source,
      order,
    });

    // Save receipt first
    await this.orderReceiptRepository.save(newOrderReceipt);

    // Update order
    order.status = OrderStatus.PAID;
    order.paid = true;
    order.paidAt = new Date();

    const savedOrder = await this.orderRepository.save(order);

    // apply action depend on payment order item
    for (const orderItem of savedOrder.orderItems) {
      switch (orderItem.item.name) {
        case ItemPackage.ONE_MILLION_PANDA_POINTS:
          await this.addOneMillionPandaPoints(order);
          break;
        case ItemPackage.OPEN_ALL_LEVELS_FOR_30_DAYS:
          await this.createSubscriptionForLevelsOpenFor30Days(order);
          break;
        case ItemPackage.OPEN_ALL_LEVELS_FOR_LIFE_TIME:
          await this.createSubscriptionForLevelsOpenForLifeTime(order);
          break;

        default:
          break;
      }
    }
  }

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
