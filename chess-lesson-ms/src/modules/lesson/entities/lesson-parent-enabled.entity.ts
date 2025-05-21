import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { LessonParent } from './lesson-parent.entity';

@Entity('lesson_parent_enabled')
@Index(['lessonParent', 'userUid'], { unique: true })
export class LessonParentEnabled {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    () => LessonParent,
    (lessonParent) => lessonParent.lessonsParentsEnabled,
    {
      nullable: false,
    },
  )
  lessonParent: LessonParent;

  @Column({ type: 'int', nullable: false })
  userUid: number; // auth reference with column UID
}
