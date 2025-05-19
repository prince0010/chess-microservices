import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { LessonLevel, lessonLevelsArray, LessonParentName } from 'src/enum';

// NORMAL
export class InsertLessonDto {
  @IsNotEmpty()
  @IsEnum(LessonLevel, {
    message: `lesson level must be a valid enum value: [${[...lessonLevelsArray]}]`,
  })
  levelName: string;

  @IsNotEmpty()
  @IsString()
  @IsEnum(LessonParentName, {
    message: `lesson parent name must be a valid enum value: ${Object.values(LessonParentName).join(', ')}`,
  })
  lessonParentName: string;
}
