import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PieceSquareLevelCompleted } from './piece-square-level-completed.entity';

@Entity('piece_square_level')
export class PieceSquareLevel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 16, nullable: false })
  level: string;

  @Column({ type: 'int', nullable: false })
  points: number;

  // Relations
  @OneToMany(
    () => PieceSquareLevelCompleted,
    (levelCompleted) => levelCompleted.pieceSquareLevel,
  )
  levelsCompleted: PieceSquareLevelCompleted[];
}
