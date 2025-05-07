import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Unique(['userUid'])
@Entity('guess_position_user_history')
export class GuessPositionUserHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  userUid: number; // auth reference with column uid

  @Column({ nullable: false, default: 0 })
  bestScore: number;
}
