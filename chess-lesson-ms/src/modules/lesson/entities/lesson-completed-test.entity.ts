import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity('lesson_completed_test')
@Index(['level', 'userUid'], { unique: true })
export class LessonCompletedTest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 16, nullable: false })
  level: string;

  @Column({ type: 'int', nullable: false })
  userUid: number; // auth reference with column UID

  @Column({ type: 'int', nullable: false, default: 10 })
  testLength: number; // 10 | 20 | 30

  @Column({ type: 'int', nullable: false, default: 0 })
  testCompleted: number; // 7 | 10 ...
}
