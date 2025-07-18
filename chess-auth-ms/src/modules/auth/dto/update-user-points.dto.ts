import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { TypeUserCounter } from 'src/enum';

export class UpdateUserPointsDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  uid: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  points: number;

  // this argument is optional because games does not increment user lessons-bots counters only global panda
  @IsOptional()
  @IsString()
  @IsEnum(TypeUserCounter)
  typeUserCounter?: TypeUserCounter; // if it is by education | puzzle | endgames | play animal bots
}
