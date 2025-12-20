import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { StorePlatform } from 'src/enum';

@Entity('order_receipt')
export class OrderReceipt {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: StorePlatform, nullable: false })
  source: StorePlatform; // also exists on order

  @Column({ type: 'json', nullable: false })
  rawReceipt: any; // full response or receipt data (SAFE & FUTURE-PROOF)

  @CreateDateColumn()
  createdAt: Date;

  // Relations
  @OneToOne(() => Order, (order) => order.receipt, {
    nullable: false,
  })
  @JoinColumn() // This makes OrderReceipt the owning side
  order: Order;
}
