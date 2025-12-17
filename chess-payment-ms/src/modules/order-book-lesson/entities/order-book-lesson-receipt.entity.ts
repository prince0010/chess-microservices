import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { OrderBookLesson } from './order-book-lesson.entity';

@Entity('order_book_lesson_receipt')
export class OrderBookLessonReceipt {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  receiptUrl: string; // Stripe receipt URL

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn({ nullable: true })
  updatedAt?: Date;

  // Relations
  @OneToOne(() => OrderBookLesson, (order) => order.receipt, {
    nullable: false,
  })
  @JoinColumn() // This makes OrderBookLessonReceipt the owning side
  order: OrderBookLesson;
}
