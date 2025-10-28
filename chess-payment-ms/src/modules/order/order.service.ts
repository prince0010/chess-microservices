import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';

import { Order } from './entities/order.entity';
import { Item } from '../item/entities/item.entity';

import { ItemService } from '../item/item.service';

import { CreateOrderDto } from './dto/create-order.dto';
import { OrderPaginationDto, PaidOrderDto } from './dto';
import { IListOrders, IPaymentSessionResponse } from 'src/interfaces';
import { OrderStatus } from 'src/enum';
import { OrderReceipt } from './entities/order-receipt.entity';
import { NATS_SERVICE } from 'src/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OrderService {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,

    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderReceipt)
    private readonly orderReceiptRepository: Repository<OrderReceipt>,

    private readonly itemService: ItemService,
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
        relations: { orderItems: true },
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
    const paymentSession = await firstValueFrom(
      this.client.send('payment.create.session', {
        order: order.id,
        currency: 'usd',
        items: order.orderItems.map((orderItem) => ({
          name: orderItem.item.name,
          price: orderItem.price,
          quantity: orderItem.quantity,
        })),
      }),
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
      const order = await this.orderRepository.findOneBy({ id });

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

  async markOrderAsPaid(paidOrderDto: PaidOrderDto): Promise<void> {
    const { orderId, stripePaymentId, receiptUrl } = paidOrderDto;

    await this.findOne(orderId);

    const newOrderReceipt = this.orderReceiptRepository.create({
      receiptUrl,
    });

    await this.orderRepository.update(
      { id: orderId },
      {
        status: OrderStatus.PAID,
        paid: true,
        paidAt: new Date(),
        stripeChargeId: stripePaymentId,
        receipt: newOrderReceipt,
      },
    );
  }
}
