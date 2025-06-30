import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
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
  @IsString()
  datePlayed: string;

  @IsString()
  @IsNotEmpty()
  pgn: string; // Full PGN game

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

export class UpdateRecordBotUserGameDto extends PartialType(
  CreateRecordBotUserGameDto,
) {}
