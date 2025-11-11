import { Item } from 'src/modules/item/entities/item.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('payment_subscription')
export class PaymentSubscription {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  userUid: number; // auth reference with column UID

  @CreateDateColumn()
  startedAt: Date;

  @Column({ type: 'datetime', nullable: false })
  expiresAt: Date; // to control 30 days levels open or any subscription

  @Column({ type: 'int', nullable: true, default: null })
  durationDays: number; // necessary because item.durationDays can be change in future

  // Relations
  @ManyToOne(() => Item, (item) => item.paymentSubscription, {
    nullable: false,
  })
  item: Item;
}
