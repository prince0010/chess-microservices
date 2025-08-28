import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Gender } from 'src/enum';

@Entity('auth_teacher') // only for teachers
export class AuthTeacher {
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

  @Column({ type: 'boolean', nullable: false, default: true })
  isActive: boolean;

  @Column({ length: 64, nullable: false, default: Gender.PRIVATE })
  gender: string;

  @Column({ type: 'date', nullable: true, default: null })
  birthday: Date | null; // to calculate age

  @Column({ length: 128, nullable: true, default: null })
  token?: string; // if it is needed to implement forgot password
}
