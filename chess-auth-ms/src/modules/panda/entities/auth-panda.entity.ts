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

  @Column({ default: 30 })
  feedValue: number; // represent 1 - 30 the level of hunger

  @Column({ default: 30 })
  sleepValue: number; // represent 1 - 30 the level of sleep

  @Column({ default: 30 })
  bathValue: number; // represent 1 - 30 the level of dirty

  @Column({
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  lastCorrectPuzzleAt: Date;

  @OneToOne(() => Auth, (auth) => auth.panda, { nullable: false })
  @JoinColumn()
  user: Auth;
}
