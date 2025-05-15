import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';
import {
  LessonLevel,
  lessonLevelsArray,
  LessonParentName,
  LessonParentTestName,
} from 'src/enum';

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

// TEST
export class GenerateLessonTestDto {
  @IsNotEmpty()
  @IsEnum(LessonLevel, {
    message: `lesson level must be a valid enum value: [${[...lessonLevelsArray]}]`,
  })
  levelName: string;

  @IsNotEmpty()
  @IsEnum(LessonParentTestName, {
    message: `lesson parent test name must be a valid enum value: [${Object.values(LessonParentTestName).join(', ')}]`,
  })
  lessonParentTestName: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  testLessonsLength: number;
}
