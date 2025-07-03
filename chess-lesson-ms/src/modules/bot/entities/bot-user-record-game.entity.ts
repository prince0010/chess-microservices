import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Bot } from './bot.entity';

import { GameResult } from 'src/enum';

// to save all bot games user plays
@Entity('bot_user_record_game')
export class BotUserRecordGame {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Bot, (bot) => bot.botUserRecordGame, {
    nullable: false,
  })
  bot: Bot;

  @Column({ type: 'int', nullable: false })
  userUid: number; // auth reference with column uid

  @Column({ length: 8, nullable: false, default: 'white' })
  color: string; // color of piece player choose

  @Column({ type: 'text', nullable: false })
  pgn: string; // Full PGN notation (all moves, metadata, etc.)

  @Column({ type: 'text', nullable: false })
  moves: string;

  @Column({ nullable: false })
  whitePlayer: string;

  @Column({ nullable: false })
  blackPlayer: string;

  @Column({ length: 16, default: GameResult.UNFINISHED })
  result: string;

  @Column({
    type: 'timestamp',
    nullable: false,
    transformer: {
      to: (value: Date | string) => new Date(value),
      from: (value: Date) => value,
    },
  })
  datePlayed: Date;

  @Column({ type: 'varchar', length: 255, default: 'Online Bot Match' })
  event: string; // Like "Online Bot Match" or future tournaments

  @Column({ type: 'varchar', length: 255, default: 'WeChess App' })
  site: string; // For example, "WeChess App" or "User vs Bot Arena"

  @Column({ type: 'varchar', length: 10, default: '1' })
  setup: string; // PGN setup flag, typically '1'

  @Column({ type: 'int', default: 0 })
  plyCount: number; // Number of half-moves in the game

  @Column({ type: 'text', nullable: true, default: null })
  currentFen?: string; // Only relevant if game is not finished

  @Column({ type: 'boolean', default: false })
  isGameFinished: boolean;

  // Optional: allow extra metadata in JSON
  // @Column({ type: 'json', nullable: true })
  // extraMeta?: Record<string, any>;
}
