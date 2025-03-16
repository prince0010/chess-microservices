import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';
import { BotUserGameResult, botUserGameResultArray } from 'src/enum';

export class CounterBotUserHistoryDto {
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  botId: number;

  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  userUid: number;

  @IsString()
  @IsNotEmpty()
  @IsEnum(BotUserGameResult, {
    message: `Bot result should be one of this: [${[...botUserGameResultArray]}]`,
  })
  result: string;
}
