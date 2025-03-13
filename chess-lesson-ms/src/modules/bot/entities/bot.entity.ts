import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BotUserHistory } from './bot-user-history.entity';

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

  @Column({ nullable: false, default: true })
  isActive: boolean;

  @Column({ nullable: true, default: null })
  avatar?: string; // image url

  @Column({ nullable: true, default: null })
  description?: string;

  // Relations
  @OneToMany(() => BotUserHistory, (botUser) => botUser.bot)
  botUsersHistory: BotUserHistory[];
}
