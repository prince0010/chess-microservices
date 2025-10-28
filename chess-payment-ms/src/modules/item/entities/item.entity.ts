import { OrderItem } from 'src/modules/order/entities/order-item.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('item')
export class Item {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, default: 'USD' })
  currency: string;

  @Column({ nullable: false })
  name: string;

  @Column({ type: 'text', nullable: false })
  description: string;

  // @Column({ nullable: false }) // use it in case pre-defined prices in stripe dashboard
  // stripePriceId: string; // Stripe Price ID

  @Column({ type: 'float', nullable: false })
  price: number;

  @Column({ nullable: false, default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: false })
  type: string; // PANDA_POINTS | SUBSCRIPTION | FEATURE_UNLOCK

  // For PANDA_POINTS type
  @Column({ type: 'int', nullable: true })
  pointsAmount?: number;

  // For SUBSCRIPTION type
  @Column({ nullable: true })
  subscriptionTier?: string;

  @Column({ type: 'int', nullable: true })
  durationDays?: number; // 30 for 1 month, 365 for 1 year

  // Relations
  @OneToMany(() => OrderItem, (orderItem) => orderItem.item)
  orderItems: OrderItem[];
}
