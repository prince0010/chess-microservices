import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Bot } from './bot.entity';

@Entity('bot_user_history')
@Unique(['bot', 'userUid']) // Ensure only one row will be created by bot-user
export class BotUserHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Bot, (bot) => bot.botUsersHistory, {
    nullable: false,
  })
  bot: Bot;

  @Column({ type: 'int', nullable: false })
  userUid: number; // auth reference with column uid

  @Column({ nullable: false, default: 0 })
  gameWon: number; // counter

  @Column({ nullable: false, default: 0 })
  gameTied: number; // counter

  @Column({ nullable: false, default: 0 })
  gameLost: number; // counter
}
