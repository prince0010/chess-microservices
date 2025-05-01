import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Unique(['userUid'])
@Entity('tetris_user_history')
export class TetrisUserHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  userUid: number; // auth reference with column uid

  @Column({ nullable: false, default: 0 })
  bestScore: number;
}
