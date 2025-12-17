import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Order } from './order.entity';

@Entity('order_receipt')
export class OrderReceipt {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  receiptUrl: string; // Store receipt URL

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn({ nullable: true })
  updatedAt?: Date;

  // Relations
  @OneToOne(() => Order, (order) => order.receipt, {
    nullable: false,
  })
  @JoinColumn() // This makes OrderReceipt the owning side
  order: Order;
}
