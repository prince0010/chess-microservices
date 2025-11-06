import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Lesson } from './lesson.entity';
import { LessonPlayed } from './lesson-played.entity';
import { LessonParentEnabled } from './lesson-parent-enabled.entity';
import { LessonParentTestRecord } from './lesson-parent-test-record.entity';
import { LessonCompletedTest } from './lesson-completed-test.entity';
import { LessonStoryName } from 'src/enum';

@Entity('lesson_parent')
export class LessonParent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 64, nullable: false })
  level: string; // LEVEL_1, LEVEL_2, etc.

  @Column({
    type: 'int',
    nullable: false,
    default: 30,
  })
  timer: number; // time countdown player has to solve every lesson child as puzzle

  @Column({ length: 128, nullable: false })
  name: string; // Pawn, King, Queen, Custom, etc.

  @Column({ nullable: false })
  nameTr: string; // for translations purpose

  @Column({ nullable: false })
  levelTr: string; // for translations purpose

  @Column({ length: 128, nullable: true, default: null })
  pgnFilename?: string; // filename of the pgn, it can be null if isTest | isGame | isBot

  @Column({ type: 'float', nullable: false, default: 0 })
  lessonFactor: number; // factor number represents the proportionality of lessonsToComplete/lessonsLength

  @Column({ length: 32, nullable: false, default: LessonStoryName.EDUCATION })
  story: string; // complexity of lessons and to differentiate them

  @Column({ type: 'int', nullable: false })
  pointsPerLesson: number;

  @Column({ type: 'int', nullable: false })
  quantityToUnlockNext: number;

  @Column({ length: 32, nullable: false })
  levelFrontend: string;

  @Column({ type: 'boolean', nullable: false, default: false })
  showHint: boolean; // to identify which of them are with hint

  @Column({ type: 'boolean', nullable: false, default: false })
  isTest: boolean; // to identify which lesson parent is a test

  @Column({ type: 'boolean', nullable: false, default: false })
  isGame: boolean;

  @Column({ type: 'boolean', nullable: false, default: false })
  isPreview: boolean; // represent a preview PGN of that level

  @Column({ type: 'boolean', nullable: false, default: false })
  isBot: boolean; // player needs to defeat specific bots

  @Column({ type: 'boolean', nullable: false, default: false })
  canBeSkipped: boolean; // player can go to next level so lessons are only information

  @Column({ length: 255, nullable: true, default: null })
  messageModal?: string; // some message modal as instruction to complete

  @OneToMany(() => Lesson, (lesson) => lesson.lessonParent, {
    cascade: ['insert'],
  })
  lessons: Lesson[];

  @OneToMany(() => LessonPlayed, (lessonPlayed) => lessonPlayed.lessonParent)
  lessonsPlayed: LessonPlayed[];

  @OneToMany(
    () => LessonParentEnabled,
    (lessonParentEnabled) => lessonParentEnabled.lessonParent,
  )
  lessonsParentsEnabled: LessonParentEnabled[];

  @OneToMany(
    () => LessonCompletedTest,
    (lessonCompletedTest) => lessonCompletedTest.lessonParent,
  )
  lessonsParentsTestCompleted: LessonCompletedTest[];

  @OneToMany(
    () => LessonParentTestRecord,
    (lessonParentTestRecord) => lessonParentTestRecord.lessonParent,
  )
  lessonParentTestRecords: LessonParentTestRecord[];
}
