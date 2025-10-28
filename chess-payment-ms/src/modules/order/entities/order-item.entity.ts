import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order.entity';
import { Item } from 'src/modules/item/entities/item.entity';

@Entity('order_item')
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, default: 1 })
  quantity: number;

  @Column({ type: 'float', nullable: false })
  price: number;

  // Relation
  @ManyToOne(() => Item, (item) => item.orderItems, { nullable: false })
  item: Item;

  @ManyToOne(() => Order, (order) => order.orderItems, {
    nullable: false,
  })
  order: Order;
}
