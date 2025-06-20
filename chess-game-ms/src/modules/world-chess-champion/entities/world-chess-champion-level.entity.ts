import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { WorldChessChampionLevelCompleted } from './world-chess-champion-level-completed.entity';

@Entity('world_chess_champion_level')
export class WorldChessChampionLevel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 16, nullable: false })
  level: string;

  @Column({ type: 'int', nullable: false })
  points: number;

  // Relations
  @OneToMany(
    () => WorldChessChampionLevelCompleted,
    (worldChessChampionLevelCompleted) =>
      worldChessChampionLevelCompleted.worldChessChampionLevel,
  )
  levelsCompleted: WorldChessChampionLevelCompleted[];
}
