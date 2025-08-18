import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Lesson } from './lesson.entity';
import { LessonSingleRecordStatus } from 'src/enum';

// to store all lessons even when already played or failed
@Entity('lesson_single_record')
export class LessonSingleRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Lesson, (lesson) => lesson.lessonsSingleRecords, {
    nullable: false,
  })
  lesson: Lesson;

  @Column({ type: 'int', nullable: false })
  userUid: number; // auth reference with column UID

  @Column({
    length: 16,
    nullable: false,
    default: LessonSingleRecordStatus.SUCCEEDED,
  })
  status: string; // SUCCEEDED | FAILED

  @CreateDateColumn()
  playedAt: Date;
}
