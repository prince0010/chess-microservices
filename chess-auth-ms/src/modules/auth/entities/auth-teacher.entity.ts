import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Auth } from './auth.entity';

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

  @ManyToMany(() => Auth, (auth) => auth.teachers, {
    cascade: ['insert', 'update'],
  })
  @JoinTable({
    name: 'auth_teacher_student', // Name of the junction table
    joinColumn: {
      name: 'teacherUid', // Name of the column referencing Auth Teacher entity
      referencedColumnName: 'uid', // Name of the referenced column in Auth Teacher entity
    },
    inverseJoinColumn: {
      name: 'studentUid', // Name of the column referencing Auth entity
      referencedColumnName: 'uid', // Name of the referenced column in Auth entity
    },
  })
  students: Auth[];
}
