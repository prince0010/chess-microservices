import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
} from 'class-validator';
import { LessonStoryName } from 'src/enum';

export class UnlockStoryDto {
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  userUid: number;

  @IsNotEmpty()
  @IsString()
  @IsEnum(LessonStoryName, {
    message: `Valid stories names are these one: [${Object.values(LessonStoryName)}]`,
  })
  story: string;
}
