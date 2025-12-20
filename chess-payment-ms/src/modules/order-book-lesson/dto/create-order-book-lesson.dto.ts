import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class CreateOrderBookLessonDto {
  @IsPositive()
  @IsNumber()
  @IsNotEmpty()
  userUid: number; // authenticated player wants to book a lesson

  @IsPositive()
  @IsNumber()
  @IsNotEmpty()
  coachId: number; // coach selected

  @IsPositive()
  @IsNumber()
  @IsNotEmpty()
  quantityLessons: number; // 1, 2, 3 or ...
}
