import { Type } from 'class-transformer';
import {
  IsEnum,
  IsIn,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';
import { LessonLevel, lessonLevelsArray, LessonStoryName } from 'src/enum';

export class FindAllLessonParentDto {
  @IsOptional()
  @IsPositive()
  @Type(() => Number) // converts query parameter string to number here
  limit?: number;

  @IsOptional()
  @Min(1)
  @Type(() => Number) // converts query parameter string to number here
  page?: number;

  @IsOptional()
  @IsString()
  @IsEnum(LessonStoryName, {
    message: `Story names allowed only these: [${Object.values(LessonStoryName)}]`,
  })
  story?: string;

  @IsOptional()
  @IsNumber()
  id?: number;

  @IsOptional()
  @IsString()
  @IsIn(['YES', 'NO'])
  isTest: string;

  @IsOptional()
  @IsEnum(LessonLevel, {
    message: `Invalid level name. Try to send one of these valid one: [${[...lessonLevelsArray]}]`,
  })
  level?: string;
}
