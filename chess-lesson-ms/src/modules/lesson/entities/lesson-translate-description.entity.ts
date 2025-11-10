import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('lesson_translate_description')
export class LessonTranslateDescription {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 16, nullable: false })
  target: string;

  @Column({ nullable: false })
  hashCode: string;

  @Column({ type: 'text', nullable: false })
  originalDescription: string;

  @Column({ type: 'text', nullable: false })
  translatedDescription: string;
}
