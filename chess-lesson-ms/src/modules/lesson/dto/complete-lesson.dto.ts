import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class CompleteLessonDto {
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  lessonId: number;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  userUid: number;
}

export class UserUidDto {
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  userUid: number;
}
