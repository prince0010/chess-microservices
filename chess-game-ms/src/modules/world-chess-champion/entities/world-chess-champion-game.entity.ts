import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('world_chess_champion_game')
export class WorldChessChampionGame {
  @PrimaryGeneratedColumn()
  id: number;

  // similar fields to Lesson Entity
  @Column({ type: 'text', nullable: true, default: null })
  description?: string;

  @Column({ type: 'text', nullable: false })
  moves: string;

  @Column({ type: 'text', nullable: false })
  pgnRaw: string;

  @Column({ nullable: true, default: null })
  fen?: string;

  // PGN Metadata
  @Column({ nullable: false, default: '?' })
  event: string; // Name of the event/tournament

  @Column({ nullable: false, default: '?' })
  site: string; // Location where the game took place

  @Column({ nullable: false, default: '????.??.??' })
  date: string; // Date in YYYY.MM.DD format

  @Column({ nullable: false, default: '?' })
  round: string; // Tournament round number

  @Column({ nullable: false, default: '?' })
  white: string; // White player name

  @Column({ nullable: false, default: '?' })
  black: string; // Black player name

  @Column({ nullable: false, default: '*' })
  result: string; // Game result (1-0, 0-1, 1/2-1/2, *)

  @Column({ nullable: false, default: '0' })
  setup: string; // Whether it's a setup position (1) or a full game (0)

  @Column({ nullable: false })
  plyCount: number; // Number of half-moves in the game

  @Column({ type: 'boolean', nullable: false, default: false })
  showHint: boolean;

  @Column({ type: 'json', nullable: true, default: null })
  hints?: {
    squares?: string[]; // ['e4']
    arrows?: string[]; // ['e2e4']
  };
}
