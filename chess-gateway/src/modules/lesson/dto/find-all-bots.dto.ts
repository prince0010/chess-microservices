import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';
import { BotDifficulty, botDifficultyArray } from 'src/enum';

export class FindAllBotsDto {
  @IsOptional()
  @IsPositive()
  @Type(() => Number) // converts query parameter string to number here
  limit?: number;

  @IsOptional()
  @Min(1)
  @Type(() => Number) // converts query parameter string to number here
  page?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  id?: number;

  @IsOptional()
  @IsEnum(BotDifficulty, {
    message: `Invalid difficulty. Try to send one of these: [${[...botDifficultyArray]}]`,
  })
  difficulty?: string;

  @IsOptional()
  @IsString()
  name?: string;
}
