import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
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

  // this argument is obligated here because animal bots update other points columns user
  @IsNotEmpty()
  @IsString()
  @IsEnum(TypeUserCounter)
  typeUserCounter: TypeUserCounter; // typeUserCounter play animal bots
}
