import { IsEnum, IsNotEmpty } from 'class-validator';
import { LessonLevel, lessonLevelsArray } from 'src/enum';

export class InsertLessonDto {
  @IsNotEmpty()
  @IsEnum(LessonLevel, {
    message: `lesson level must be a valid enum value: [${[...lessonLevelsArray]}]`,
  })
  levelName: string;
}
