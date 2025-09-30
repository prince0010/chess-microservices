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
  id: number;

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

  @Column({ length: 32, nullable: true, default: null })
  fideId?: string;

  @Column({ type: 'simple-array', nullable: true, default: null })
  languages: string[];

  @Column({ type: 'simple-array', nullable: true, default: null })
  documents: string[]; // Store file URLs

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
