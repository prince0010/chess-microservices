import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrderService {
  // async create(createOrderDto: CreateOrderDto) {
  //   try {
  //     // 1- validate items IDS exist on database items
  //     const itemIds = createOrderDto.items.map((e) => e.itemId);
  //     const products: any[] = await firstValueFrom(
  //       this.client.send({ cmd: 'validate_products' }, productIds),
  //     );
  //     // 2- calculate total price for each product * quantity (total)
  //     const totalAmount = createOrderDto.items.reduce((acc, orderItem) => {
  //       const price = products.find(
  //         (product) => product.id === orderItem.productId,
  //       ).price;
  //       return acc + price * orderItem.quantity;
  //     }, 0);
  //     // 3- calculate total items was bought
  //     const totalItems = createOrderDto.items.reduce((acc, orderItem) => {
  //       return acc + orderItem.quantity;
  //     }, 0);
  //     // 4- create a transaction in database
  //     const order = await this.order.create({
  //       data: {
  //         totalAmount: totalAmount,
  //         totalItems: totalItems,
  //         OrderItem: {
  //           createMany: {
  //             data: createOrderDto.items.map((orderItem) => ({
  //               quantity: orderItem.quantity,
  //               productId: orderItem.productId,
  //               price: products.find(
  //                 (product) => product.id === orderItem.productId,
  //               ).price,
  //             })),
  //           },
  //         },
  //       },
  //       include: {
  //         OrderItem: {
  //           select: {
  //             quantity: true,
  //             price: true,
  //             productId: true,
  //           },
  //         },
  //       },
  //     });
  //     return {
  //       ...order,
  //       OrderItem: order.OrderItem.map((orderItem) => ({
  //         ...orderItem,
  //         name: products.find((product) => product.id === orderItem.productId)
  //           .name,
  //       })),
  //     };
  //   } catch (error) {
  //     throw new RpcException({
  //       message: error.message,
  //       status: 400,
  //     });
  //   }
  // }
  // findAll() {
  //   return `This action returns all order`;
  // }
  // findOne(id: number) {
  //   return `This action returns a #${id} order`;
  // }
  // update(id: number, updateOrderDto: UpdateOrderDto) {
  //   return `This action updates a #${id} order`;
  // }
  // remove(id: number) {
  //   return `This action removes a #${id} order`;
  // }
}
