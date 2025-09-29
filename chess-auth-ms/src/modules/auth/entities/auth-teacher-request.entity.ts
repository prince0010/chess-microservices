import { TeacherRequestStatus } from 'src/enum';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('auth_teacher_request')
export class AuthTeacherRequest {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({
    length: 16,
    nullable: false,
    default: TeacherRequestStatus.pending,
  })
  status: string;

  @Column({ length: 64, nullable: false })
  name: string;

  @Column({ length: 128, nullable: false })
  lastName: string;

  @Column({ length: 128, nullable: false })
  email: string;

  @Column({ length: 32, nullable: false })
  mobile: string;

  @Column({ length: 32, nullable: false })
  country: string;

  @Column({ type: 'int', nullable: false })
  yearsExperience: number;

  @Column({ type: 'int', nullable: false })
  age: number;

  @Column({ length: 16, nullable: false })
  gender: string;

  @Column({ type: 'text', nullable: true, default: null })
  details?: string;

  @Column({ type: 'simple-array', nullable: true, default: null })
  listExperience: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
