import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { OrderBookLessonReceipt } from './order-book-lesson-receipt.entity';

import { OrderStatus } from 'src/enum';

@Entity('order_book_lesson')
export class OrderBookLesson {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int', nullable: false })
  totalLessons: number;

  @Column({ type: 'float', nullable: false })
  pricePerHour: number; // it maybe change over time and is needed to store the price at that moment

  @Column({ type: 'float', nullable: false })
  totalAmount: number; // pricePerHour * totalLessons

  @Column({ nullable: true, default: null })
  stripeChargeId?: string; // when stripe receive the payment and return an id

  @Column({ type: 'int', nullable: false })
  userUid: number; // auth reference with column UID player

  @Column({ type: 'int', nullable: false })
  coachId: number; // coach reference with column ID

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

  @OneToOne(() => OrderBookLessonReceipt, (receipt) => receipt.order, {
    cascade: true,
  })
  receipt: OrderBookLessonReceipt;
}
