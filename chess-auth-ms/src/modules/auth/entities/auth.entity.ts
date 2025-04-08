import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { AuthPanda } from 'src/modules/panda/entities/auth-panda.entity';

import { Gender } from 'src/enum';

@Entity('auth')
export class Auth {
  @PrimaryGeneratedColumn()
  uid: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false, unique: true })
  username: string;

  @Column({ nullable: false })
  password: string;

  @Column({ length: 128, nullable: false })
  country: string;

  @Column({ length: 64, nullable: false, default: Gender.PRIVATE })
  gender: string;

  @Column({ type: 'date', nullable: true, default: null })
  birthday: Date | null; // to calculate age

  @Column({ length: 128, nullable: true, default: null })
  token?: string; // if it is needed to implement forgot password

  @Column({ type: 'simple-array', default: 'PLAYER' })
  roles: string[];

  @Column({ type: 'boolean', nullable: false, default: true })
  isActive: boolean;

  @Column({ nullable: false, default: 0 })
  points: number;

  @OneToOne(() => AuthPanda, (panda) => panda.user)
  panda: AuthPanda;
}
