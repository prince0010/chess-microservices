import { OrderBookLesson } from 'src/modules/order-book-lesson/entities/order-book-lesson.entity';
import { Order } from 'src/modules/order/entities/order.entity';

export interface IListOrders {
  currentPage: number;
  total: number;
  orders: Order[];
}

export interface IListBookOrders {
  currentPage: number;
  total: number;
  orders: OrderBookLesson[];
}
