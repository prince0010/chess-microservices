import { IsBoolean, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import {
  LessonLevel,
  lessonLevelsArray,
  LessonParentName,
  LessonStoryName,
} from 'src/enum';

export class CreateLessonParentDto {
  @IsNotEmpty()
  @IsEnum(LessonLevel, {
    message: `lesson level must be a valid enum value: [${[...lessonLevelsArray]}]`,
  })
  level: string;

  @IsNotEmpty()
  @IsString()
  @IsEnum(LessonStoryName, {
    message: `Story names allowed only these: [${Object.values(LessonStoryName)}]`,
  })
  story: string;

  @IsNotEmpty()
  @IsString()
  @IsEnum(LessonParentName, {
    message: `lesson parent name must be a valid enum value: ${Object.values(LessonParentName).join(', ')}`,
  })
  name: string;

  @IsBoolean()
  @IsNotEmpty()
  showHint: boolean;

  @IsBoolean()
  @IsNotEmpty()
  isTest: boolean = false;
}
