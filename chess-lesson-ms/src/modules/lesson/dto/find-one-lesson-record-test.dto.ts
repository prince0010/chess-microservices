import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive } from 'class-validator';

export class FindOneLessonRecordTestDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  studentUid?: number; // when teacher see student progress on web system panel

  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  userUid: number;

  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  recordId: number;
}
