import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order.entity';

@Entity('order_item')
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, default: 1 })
  quantity: number;

  @Column({ type: 'float', nullable: false })
  price: number;

  // TODO: relation with Item

  @ManyToOne(() => Order, (order) => order.orderItems, {
    nullable: false,
  })
  order: Order;
}
