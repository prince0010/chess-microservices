import {
  Entity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  Index,
} from 'typeorm';
import { Lesson } from './lesson.entity';

@Entity('lesson_completed')
@Index(['lesson', 'userUid'], { unique: true })
export class LessonCompleted {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Lesson, (lesson) => lesson.lessonsCompleted, {
    nullable: false,
  })
  lesson: Lesson;

  @Column({ type: 'int', nullable: false })
  userUid: number; // auth reference with column UID
}
