import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { OrderItem } from './order-item.entity';
import { OrderReceipt } from './order-receipt.entity';
import { OrderStatus } from 'src/enum';

@Entity('order')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'float', nullable: false })
  totalAmount: number;

  @Column({ type: 'int', nullable: false })
  totalItems: number;

  @Column({ nullable: true, default: null })
  stripeChargeId?: string; // when stripe receive the payment and return an id

  // in the app always exists userUid but maybe in website not user authenticated
  @Column({ type: 'int', nullable: true, default: null })
  userUid?: number; // auth reference with column UID

  @Column({ length: 32, nullable: false, default: OrderStatus.PENDING })
  status: string;

  @Column({ nullable: false, default: false })
  paid: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true, default: null })
  paidAt?: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true, default: null })
  updatedAt?: Date;

  // Relations
  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, {
    cascade: ['insert'],
  })
  orderItems: OrderItem[];

  @OneToOne(() => OrderReceipt, (receipt) => receipt.order, {
    cascade: true,
  })
  receipt: OrderReceipt;
}
