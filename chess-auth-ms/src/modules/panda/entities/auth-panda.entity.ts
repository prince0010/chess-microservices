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

  // @Column({ default: 100 }) // Could drop slowly if neglected
  // happiness: number;

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
