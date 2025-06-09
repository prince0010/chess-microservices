import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Unique(['userUid'])
@Entity('guess_piece_square_user_history')
export class GuessPieceSquareUserHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  userUid: number; // auth reference with column uid

  @Column({ nullable: false, default: 0 })
  bestScore: number;
}
