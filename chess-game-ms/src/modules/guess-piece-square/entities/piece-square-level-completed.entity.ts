import {
  Entity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  Index,
} from 'typeorm';
import { PieceSquareLevel } from './piece-square-level.entity';

@Entity('piece_square_level_completed')
@Index(['pieceSquareLevel', 'userUid'], { unique: true })
export class PieceSquareLevelCompleted {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    () => PieceSquareLevel,
    (pieceSquareLevel) => pieceSquareLevel.levelsCompleted,
    {
      nullable: false,
    },
  )
  pieceSquareLevel: PieceSquareLevel;

  @Column({ type: 'int', nullable: false })
  userUid: number; // auth reference with column UID
}
