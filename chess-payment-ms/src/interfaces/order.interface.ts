import { Order } from 'src/modules/order/entities/order.entity';

export interface IListOrders {
  currentPage: number;
  total: number;
  orders: Order[];
}
