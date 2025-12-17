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
import { OrderStatus, StorePlatform } from 'src/enum';

@Entity('order')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'float', nullable: false })
  totalAmount: number;

  @Column({ type: 'int', nullable: false })
  totalItems: number;

  @Column({ type: 'enum', enum: StorePlatform, nullable: false })
  source: string; // app_store || play_store

  @Column({ nullable: false, unique: true })
  storeChargeId: string; // for both apple and google

  @Column({ type: 'int', nullable: false })
  userUid: number; // auth reference with column UID

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
