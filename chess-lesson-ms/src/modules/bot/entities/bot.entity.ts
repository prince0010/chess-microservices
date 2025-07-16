import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BotUserHistory } from './bot-user-history.entity';
import { BotUserRecordGame } from './bot-user-record-game.entity';

@Entity('bot')
export class Bot {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  difficulty: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  elo: number;

  @Column({ nullable: false })
  animal: string; // animal name

  @Column({ nullable: false, default: 5 })
  pointsWhenWin: number;

  @Column({ nullable: false, default: 0 })
  pointsWhenTied: number;

  @Column({ nullable: false, default: true })
  isActive: boolean;

  @Column({ nullable: true, default: null })
  avatar?: string; // NOT USED BY THE MOMENT image url

  @Column({ nullable: true, default: null })
  description?: string; // NOT USED BY THE MOMENT

  // Relations
  @OneToMany(() => BotUserHistory, (botUser) => botUser.bot)
  botUsersHistory: BotUserHistory[];

  @OneToMany(
    () => BotUserRecordGame,
    (botUserRecordGame) => botUserRecordGame.bot,
  )
  botUserRecordGame: BotUserRecordGame[];
}
