import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { GameResult } from 'src/enum';

export class UpdateRecordBotUserGameDto {
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  userUid: number;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  moves: string[];

  @IsString()
  @IsEnum(GameResult, {
    message: `Game result string only these: [${Object.values(GameResult)}]`,
  })
  result: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  plyCount?: number;

  @IsOptional()
  @IsBoolean()
  isGameFinished?: boolean;

  @IsOptional()
  currentFen?: string;
}
