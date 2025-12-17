import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { firstValueFrom } from 'rxjs';

import { NATS_SERVICE } from 'src/config';
import { OrderBookLesson } from './entities/order-book-lesson.entity';
import { OrderBookLessonReceipt } from './entities/order-book-lesson-receipt.entity';

import { NotificationPurchaseService } from '../notification/notification-purchase.service';

import { IListBookOrders, IPaymentSessionStripeResponse } from 'src/interfaces';
import { PaymentSessionDto } from '../payment/dto/payment-session.dto';
import {
  CreateOrderBookLessonDto,
  FailedOrderBookLessonDto,
  OrderBookLessonPaginationDto,
  PaidOrderBookLessonDto,
} from './dto';
import { OrderStatus } from 'src/enum';

@Injectable()
export class OrderBookLessonService {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
    private readonly notificationPurchaseService: NotificationPurchaseService,

    @InjectRepository(OrderBookLesson)
    private readonly orderBookLessonRepository: Repository<OrderBookLesson>,
    @InjectRepository(OrderBookLessonReceipt)
    private readonly orderBookLessonReceiptRepository: Repository<OrderBookLessonReceipt>,
  ) {}

  async create(dto: CreateOrderBookLessonDto): Promise<OrderBookLesson> {
    const { userUid, coachId } = dto;
    try {
      const user = await firstValueFrom(
        this.client.send('auth.findone.user', { id: coachId }),
      );

      const coach = await firstValueFrom(
        this.client.send('coach.find.one', { id: coachId }),
      );

      const pricePerHour = coach.price;
      const totalLessons = dto.quantityLessons;
      const totalAmount = totalLessons * pricePerHour;

      const newOrderBookLesson = this.orderBookLessonRepository.create({
        totalLessons,
        pricePerHour,
        totalAmount,
        userUid,
        coachId,
      });

      const savedOrder =
        await this.orderBookLessonRepository.save(newOrderBookLesson);

      return savedOrder;
    } catch (error) {
      throw new RpcException({
        message: error.message,
        status: 400,
      });
    }
  }

  // STEP 2
  async createPaymentSession(
    order: OrderBookLesson,
  ): Promise<IPaymentSessionStripeResponse> {
    const dataPaymentSessionDto: PaymentSessionDto = {
      orderId: order.id,
      currency: 'usd',
      items: [
        // always one item
        {
          name: 'BOOK_WE_CHESS_LESSON_WITH_COACH',
          price: order.pricePerHour,
          quantity: order.totalLessons,
        },
      ],
    };

    const paymentSession = await firstValueFrom(
      this.client.send('payment.create.session', dataPaymentSessionDto),
    );

    return paymentSession;
  }

  async findAll(dto: OrderBookLessonPaginationDto): Promise<IListBookOrders> {
    const { limit = 12, page = 1, status = null } = dto;

    const offset = (page - 1) * limit;

    const findOptions: FindManyOptions<OrderBookLesson> = {
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
      const [orders, total] = await this.orderBookLessonRepository.findAndCount(
        {
          ...findOptions,
        },
      );

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

  async findOne(id: string): Promise<OrderBookLesson> {
    try {
      const order = await this.orderBookLessonRepository.findOne({
        where: { id },
        relations: { receipt: true },
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

  async markOrderBookLessonAsFailed(
    dto: FailedOrderBookLessonDto,
  ): Promise<void> {
    const { orderBookLessonId, stripePaymentId } = dto;

    const order = await this.findOne(orderBookLessonId);

    // Update order
    order.status = OrderStatus.CANCELLED;
    order.stripeChargeId = stripePaymentId;

    await this.orderBookLessonRepository.save(order);

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

  async markOrderBookLessonAsPaid(dto: PaidOrderBookLessonDto): Promise<void> {
    const { orderBookLessonId, stripePaymentId, receiptUrl } = dto;

    const order = await this.findOne(orderBookLessonId);

    const newOrderReceipt = this.orderBookLessonReceiptRepository.create({
      receiptUrl,
      order,
    });

    // Save receipt first
    const savedReceipt =
      await this.orderBookLessonReceiptRepository.save(newOrderReceipt);

    // Update order
    order.status = OrderStatus.PAID;
    order.paid = true;
    order.paidAt = new Date();
    order.stripeChargeId = stripePaymentId;
    order.receipt = savedReceipt;

    const savedOrder = await this.orderBookLessonRepository.save(order);

    // TODO: send custom email to customer and to coach
    // create customer and coach notification - maybe in future is needed
  }
}
