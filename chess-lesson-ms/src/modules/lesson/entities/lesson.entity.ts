import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { LessonLevel } from 'src/enum';
import { LessonCompleted } from './lesson-completed.entity';

@Entity('lesson')
export class Lesson {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, default: LessonLevel.LEVEL_1 })
  level: string;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ type: 'text', nullable: false })
  moves: string;

  @Column({ type: 'text', nullable: false })
  pgnRaw: string;

  @Column({ nullable: false })
  fen: string;

  @Column({ nullable: false })
  points: number;

  // PGN Metadata
  @Column({ nullable: false, default: '?' })
  event: string; // Name of the event/tournament

  @Column({ nullable: false, default: '?' })
  site: string; // Location where the game took place

  @Column({ nullable: false, default: '????.??.??' })
  date: string; // Date in YYYY.MM.DD format

  @Column({ nullable: false, default: '?' })
  round: string; // Tournament round number

  @Column({ nullable: false, default: '?' })
  white: string; // White player name

  @Column({ nullable: false, default: '?' })
  black: string; // Black player name

  @Column({ nullable: false, default: '*' })
  result: string; // Game result (1-0, 0-1, 1/2-1/2, *)

  @Column({ nullable: false, default: '1' })
  setup: string; // Whether it's a setup position (1) or a full game (0)

  @Column({ nullable: false })
  plyCount: number; // Number of half-moves in the game

  // Relations
  @OneToMany(() => LessonCompleted, (lessonCompleted) => lessonCompleted.lesson)
  lessonsCompleted: LessonCompleted[];
}
