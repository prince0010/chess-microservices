import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { firstValueFrom } from 'rxjs';

import { NATS_SERVICE } from 'src/config';
import { Order } from './entities/order.entity';
import { Item } from '../item/entities/item.entity';
import { OrderReceipt } from './entities/order-receipt.entity';

import { ItemService } from '../item/item.service';
import { NotificationPurchaseService } from '../notification/notification-purchase.service';

import { CreateOrderDto } from './dto/create-order.dto';
import { FailedOrderDto, OrderPaginationDto, PaidOrderDto } from './dto';
import { IListOrders, IPaymentSessionResponse } from 'src/interfaces';
import { PaymentSessionDto } from '../payment/dto/payment-session.dto';
import { UpdateUserPointsAfterPurchaseDto } from './dto/update-user-points-after-purchase.dto';
import {
  ItemPackage,
  NotificationPurchaseMessage,
  NotificationPurchaseTitle,
  NotificationPurchaseType,
  OrderStatus,
} from 'src/enum';
import { CreateNotificationPurchaseDto } from '../notification/dto/create-notification-purchase.dto';
import { CreatePaymentSubscriptionDto } from '../payment-subscription/dto/create-payment-subscription.dto';

@Injectable()
export class OrderService {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,

    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderReceipt)
    private readonly orderReceiptRepository: Repository<OrderReceipt>,

    private readonly itemService: ItemService,
    private readonly notificationPurchaseService: NotificationPurchaseService,
  ) {}

  // STEP 1
  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const { userUid } = createOrderDto;
    try {
      // 1- validate items IDS exist on database
      const itemIds = createOrderDto.items.map((e) => e.itemId);
      const items = await this.itemService.validateItems(itemIds);

      // 2- calculate total price for each item * quantity (total)
      const totalAmount = createOrderDto.items.reduce((acc, orderItem) => {
        const price = items.find((e) => e.id === orderItem.itemId).price;

        return acc + price * orderItem.quantity;
      }, 0);

      // 3- calculate total items was bought
      const totalItems = createOrderDto.items.reduce((acc, orderItem) => {
        return acc + orderItem.quantity;
      }, 0);

      // 4- create orderItems
      const orderItems: any[] = items.map((item: Item) => ({
        price: item.price,
        quantity: createOrderDto.items.find(
          (orderItem) => orderItem.itemId === item.id,
        ).quantity,
        item,
      }));

      // 5- insert on database
      const newOrder = this.orderRepository.create({
        totalAmount,
        totalItems: totalItems,
        userUid,
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

  // STEP 2
  async createPaymentSession(order: Order): Promise<IPaymentSessionResponse> {
    const dataPaymentSessionDto: PaymentSessionDto = {
      orderId: order.id,
      currency: 'usd',
      items: order.orderItems.map((orderItem) => ({
        name: orderItem.item.name,
        price: orderItem.price,
        quantity: orderItem.quantity,
      })),
    };

    const paymentSession = await firstValueFrom(
      this.client.send('payment.create.session', dataPaymentSessionDto),
    );

    return paymentSession;
  }

  async findAll(orderPaginationDto: OrderPaginationDto): Promise<IListOrders> {
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

  async markOrderAsFailed(failedOrderDto: FailedOrderDto): Promise<void> {
    const { orderId, stripePaymentId } = failedOrderDto;

    const order = await this.findOne(orderId);

    // Update order
    order.status = OrderStatus.CANCELLED;
    order.stripeChargeId = stripePaymentId;

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

  async markOrderAsPaid(paidOrderDto: PaidOrderDto): Promise<void> {
    const { orderId, stripePaymentId, receiptUrl } = paidOrderDto;

    const order = await this.findOne(orderId);

    const newOrderReceipt = this.orderReceiptRepository.create({
      receiptUrl,
      order,
    });

    // Save receipt first
    const savedReceipt =
      await this.orderReceiptRepository.save(newOrderReceipt);

    // Update order
    order.status = OrderStatus.PAID;
    order.paid = true;
    order.paidAt = new Date();
    order.stripeChargeId = stripePaymentId;
    order.receipt = savedReceipt;

    const savedOrder = await this.orderRepository.save(order);

    // apply action depend on payment order item
    for (const orderItem of savedOrder.orderItems) {
      switch (orderItem.item.name) {
        case ItemPackage.ONE_MILLION_PANDA_POINTS:
          // create notification payment succeed
          const dataNotification: CreateNotificationPurchaseDto = {
            userUid: order.userUid,
            type: NotificationPurchaseType.PAYMENT_SUCCESS,
            title: NotificationPurchaseTitle.PAYMENT_RECEIVED_TITLE,
            message:
              NotificationPurchaseMessage.ONE_MILLION_PANDA_POINTS_ADDED_MESSAGE,
            orderId: order.id,
          };

          await this.notificationPurchaseService.create(dataNotification);

          await this.addOneMillionPandaPoints(order.userUid);
          break;
        case ItemPackage.OPEN_ALL_LEVELS_FOR_30_DAYS:
          // create notification payment succeed
          const dataNotificationFor30Days: CreateNotificationPurchaseDto = {
            userUid: order.userUid,
            type: NotificationPurchaseType.PAYMENT_SUCCESS,
            title: NotificationPurchaseTitle.PAYMENT_RECEIVED_TITLE,
            message:
              NotificationPurchaseMessage.ALL_LEVELS_OPEN_FOR_30_DAYS_MESSAGE,
            orderId: order.id,
          };

          await this.notificationPurchaseService.create(
            dataNotificationFor30Days,
          );

          await this.createSubscriptionForLevelsOpenFor30Days(order);
          break;
        case ItemPackage.OPEN_ALL_LEVELS_FOR_LIFE_TIME:
          // create notification payment succeed
          const dataNotificationForLifeTime: CreateNotificationPurchaseDto = {
            userUid: order.userUid,
            type: NotificationPurchaseType.PAYMENT_SUCCESS,
            title: NotificationPurchaseTitle.PAYMENT_RECEIVED_TITLE,
            message:
              NotificationPurchaseMessage.ALL_LEVELS_OPEN_FOR_LIFE_TIME_MESSAGE,
            orderId: order.id,
          };

          await this.notificationPurchaseService.create(
            dataNotificationForLifeTime,
          );

          await this.createSubscriptionForLevelsOpenForLifeTime(order);
          break;

        default:
          break;
      }
    }
  }

  private async addOneMillionPandaPoints(userUid: number): Promise<void> {
    const payload: UpdateUserPointsAfterPurchaseDto = {
      uid: userUid,
      points: 1000000,
    };
    await firstValueFrom(this.client.send('update.points.user', payload));
  }

  private async createSubscriptionForLevelsOpenFor30Days(
    order: Order,
  ): Promise<void> {
    for (const orderItem of order.orderItems) {
      if (orderItem.item.name === ItemPackage.OPEN_ALL_LEVELS_FOR_30_DAYS) {
        const payload: CreatePaymentSubscriptionDto = {
          userUid: order.userUid,
          durationDays: orderItem.item.durationDays,
          itemId: orderItem.item.id,
        };

        await firstValueFrom(
          this.client.send('paymentSubscription.create.one', payload),
        );
      }
    }
  }

  private async createSubscriptionForLevelsOpenForLifeTime(
    order: Order,
  ): Promise<void> {
    for (const orderItem of order.orderItems) {
      if (orderItem.item.name === ItemPackage.OPEN_ALL_LEVELS_FOR_LIFE_TIME) {
        const payload: CreatePaymentSubscriptionDto = {
          userUid: order.userUid,
          durationDays: orderItem.item.durationDays,
          itemId: orderItem.item.id,
        };

        await firstValueFrom(
          this.client.send('paymentSubscription.create.one', payload),
        );
      }
    }
  }
}
