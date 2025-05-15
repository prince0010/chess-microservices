import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Lesson } from './lesson.entity';

@Entity('lesson_parent')
export class LessonParent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 16, nullable: false })
  level: string; // LEVEL_1, LEVEL_2, etc.

  @Column({ length: 128, nullable: false })
  name: string; // Pawn, King, Queen, Custom, etc.

  @Column({ type: 'boolean', nullable: false, default: false })
  showHint: boolean; // to identify which of them are with hint

  @Column({ type: 'boolean', nullable: false, default: false })
  isTest: boolean; // to identify which lesson parent is a test

  @OneToMany(() => Lesson, (lesson) => lesson.lessonParent, {
    cascade: ['insert'],
  })
  lessons: Lesson[];
}
