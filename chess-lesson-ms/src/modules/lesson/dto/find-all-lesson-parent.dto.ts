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
import { LessonStoryName } from 'src/enum';

export class FindAllLessonParentDto {
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  userUid: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  studentUid?: number; // when teacher see student progress on web system panel

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
  @IsIn(['YES', 'NO'])
  isTest: string;

  @IsOptional()
  @IsString()
  @IsIn(['YES', 'NO'])
  onlyLessons: string;

  @IsOptional()
  @IsString()
  @IsEnum(LessonStoryName, {
    message: `Story names allowed only these: [${Object.values(LessonStoryName)}]`,
  })
  story?: string;

  @IsOptional()
  @IsNumber()
  id?: number;
}
