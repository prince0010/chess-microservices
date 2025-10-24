import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('lesson_advanced')
export class LessonAdvanced {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 32, nullable: false })
  folder: string;

  @Column({ nullable: false })
  name: string;

  @Column({ length: 64, nullable: false })
  filename: string;

  @Column({ type: 'text', nullable: false })
  pgnRaw: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'json', nullable: false })
  metadata: {
    event?: string;
    site?: string;
    date?: string;
    round?: string;
    white?: string;
    black?: string;
    result?: string;
    eco?: string;
    annotator?: string;
    plyCount?: number;
  };

  @Column({ type: 'json', nullable: false })
  movesTree: any; // Nested structure of moves + comments + variations
}
