import { Type } from 'class-transformer';
import { IsNumber, IsPositive } from 'class-validator';

export class FindOneLessonRecordTestDto {
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  userUid: number;

  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  recordId: number;
}
