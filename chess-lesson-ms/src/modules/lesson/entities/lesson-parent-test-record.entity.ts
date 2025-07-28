import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { LessonParent } from './lesson-parent.entity';

@Entity('lesson_parent_test_record')
export class LessonParentTestRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    () => LessonParent,
    (lessonParent) => lessonParent.lessonParentTestRecords,
    {
      nullable: false,
    },
  )
  lessonParent: LessonParent;

  @Column({ type: 'int', nullable: false })
  userUid: number; // auth reference with column UID

  @Column({ type: 'simple-array', nullable: false })
  lessons: string[]; // the completed random test lessons

  @CreateDateColumn()
  playedAt: Date;

  @Column({ type: 'int', nullable: true, default: null })
  failedLessonId?: number; // to track the lessonId player could failed when lost their 3rd live
}
