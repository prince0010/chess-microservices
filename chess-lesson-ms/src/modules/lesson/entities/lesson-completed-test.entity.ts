import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { LessonParent } from './lesson-parent.entity';

@Entity('lesson_completed_test')
export class LessonCompletedTest {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    () => LessonParent,
    (lessonParent) => lessonParent.lessonsParentsTestCompleted,
    {
      nullable: false,
    },
  )
  lessonParent: LessonParent;

  @Column({ type: 'int', nullable: false })
  userUid: number; // auth reference with column UID

  @Column({ type: 'int', nullable: false, default: 10 })
  testLength: number; // 10 | 20 | 30

  @Column({ type: 'int', nullable: false, default: 0 })
  testCompleted: number; // 7 | 10 ...
}
