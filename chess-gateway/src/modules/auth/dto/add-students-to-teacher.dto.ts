import { ArrayMinSize, IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class AddStudentsToTeacherDto {
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @IsNumber({}, { each: true })
  studentUids: number[];
}
