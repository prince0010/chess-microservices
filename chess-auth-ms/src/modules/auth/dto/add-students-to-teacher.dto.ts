import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsPositive,
} from 'class-validator';

export class AddStudentsToTeacherDto {
  @IsNotEmpty()
  @IsPositive()
  @IsNumber()
  teacherUid: number;

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @IsNumber({}, { each: true })
  studentUids: number[];
}
