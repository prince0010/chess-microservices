import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  ManyToOne,
} from 'typeorm';
import { LessonParent } from './lesson-parent.entity';

@Entity('lesson_played')
@Index(['lessonParent', 'userUid'], { unique: true })
export class LessonPlayed {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => LessonParent, (lessonParent) => lessonParent.lessonsPlayed, {
    nullable: false,
  })
  lessonParent: LessonParent;

  @Column({ type: 'int', nullable: false })
  userUid: number; // auth reference with column UID

  @Column({ type: 'int', nullable: false })
  lastLessonPlayed: number; // reference to Lesson Table column ID
}
