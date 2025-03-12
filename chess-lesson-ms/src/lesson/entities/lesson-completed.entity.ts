import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Lesson } from './lesson.entity';

@Entity('lesson_completed')
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
