import {
  Entity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  Index,
} from 'typeorm';
import { WorldChessChampionLevel } from './world-chess-champion-level.entity';

@Entity('world_chess_champion_level_completed')
@Index(['worldChessChampionLevel', 'userUid'], { unique: true })
export class WorldChessChampionLevelCompleted {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    () => WorldChessChampionLevel,
    (worldChessChampionLevel) => worldChessChampionLevel.levelsCompleted,
    {
      nullable: false,
    },
  )
  worldChessChampionLevel: WorldChessChampionLevel;

  @Column({ type: 'int', nullable: false })
  userUid: number; // auth reference with column UID

  @Column({ type: 'int', nullable: false, default: 0 })
  counter: number; // how many times user complete this level
}
