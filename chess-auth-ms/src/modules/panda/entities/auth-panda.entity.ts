import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Auth } from 'src/modules/auth/entities/auth.entity';
import { PandaState } from 'src/enum';

@Entity('auth_panda')
export class AuthPanda {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 64, nullable: false, default: PandaState.HAPPY })
  state: string;

  @Column({ default: 100 }) // Could drop slowly by time pass without feed
  feedValue: number; // represent 1 - 100 the level of hunger

  @Column({ default: 100 }) // Could drop slowly by time pass without sleep
  sleepValue: number; // represent 1 - 100 the level of sleep

  @Column({ default: 100 }) // Could drop slowly by time pass without bath
  bathValue: number; // represent 1 - 100 the level of dirty

  @Column({
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  lastFeedAt: Date;

  @Column({
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  lastSleepAt: Date;

  @Column({
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  lastBathAt: Date;

  @OneToOne(() => Auth, (auth) => auth.panda, { nullable: false })
  @JoinColumn()
  user: Auth;
}
