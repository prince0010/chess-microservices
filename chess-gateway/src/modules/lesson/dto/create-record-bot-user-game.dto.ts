import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { GameResult } from 'src/enum';

export class CreateRecordBotUserGameDto {
  @IsPositive()
  @IsNumber()
  botId: number;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  datePlayed: Date;

  @IsNotEmpty()
  @IsString()
  @IsIn(['white', 'black'])
  color: string; // which color player select to play against the bot

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  moves: string[];

  @IsString()
  @IsNotEmpty()
  whitePlayer: string;

  @IsString()
  @IsNotEmpty()
  blackPlayer: string;

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
  currentFen?: string; // Only if unfinished
}
