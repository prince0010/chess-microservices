import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BotUserHistory } from './bot-user-history.entity';
import { BotUserRecordGame } from './bot-user-record-game.entity';
import { Gender } from 'src/enum';

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

  @Column({ length: 16, nullable: false, default: Gender.MALE })
  gender: string;

  @Column({ nullable: false, default: true })
  isActive: boolean;

  @Column({ nullable: true, default: null })
  avatar?: string; // image url

  @Column({ nullable: true, default: null })
  description?: string;

  @Column({ nullable: false, default: 1 })
  pointsWhenWin: number;

  @Column({ nullable: false, default: 1 })
  pointsWhenTied: number;

  // Relations
  @OneToMany(() => BotUserHistory, (botUser) => botUser.bot)
  botUsersHistory: BotUserHistory[];

  @OneToMany(
    () => BotUserRecordGame,
    (botUserRecordGame) => botUserRecordGame.bot,
  )
  botUserRecordGame: BotUserRecordGame[];
}
