import {
  NotificationDestination,
  NotificationPurchaseType,
} from '../../../enum/notification-purchase.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('notification_purchase')
export class NotificationPurchase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  userUid: number; // reference to Auth user

  @Column({ type: 'enum', enum: NotificationPurchaseType, nullable: false })
  type: NotificationPurchaseType;

  @Column({ type: 'enum', enum: NotificationDestination, nullable: false })
  destination: NotificationDestination; // APP | WEBSITE

  @Column({ nullable: false })
  title: string; // needs to match frontend translation key for title

  @Column({ type: 'text', nullable: false })
  message: string; // needs to match frontend translation key for message

  @Column({ nullable: false })
  orderId: string; // Related order ID for quick traceability - just the reference

  @Column({ type: 'boolean', default: false })
  isGlobal: boolean; // If true, notification is visible globally to all users.

  @Column({ type: 'boolean', nullable: false, default: false })
  isRead: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn({ nullable: true })
  updatedAt?: Date;
}
