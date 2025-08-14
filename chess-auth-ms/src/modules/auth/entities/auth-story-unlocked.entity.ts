import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Auth } from './auth.entity';
import { ModeSomeStoryCanBeUnlocked } from 'src/enum/story-unlocked.enum';

@Entity('auth_story_unlocked')
@Unique(['story', 'user']) // just one row by story-user
export class AuthStoryUnlocked {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 32, nullable: false })
  story: string; // Puzzle | Endgame | Botgame

  @ManyToOne(() => Auth, (auth) => auth.storiesUnlocked, { nullable: false })
  user: Auth;

  @Column({
    length: 32,
    nullable: false,
    default: ModeSomeStoryCanBeUnlocked.COMPLETING_LESSONS,
  })
  modeWasUnlocked: string;
}
