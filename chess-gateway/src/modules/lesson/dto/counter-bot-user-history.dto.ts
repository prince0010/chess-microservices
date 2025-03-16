import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { BotUserGameResult, botUserGameResultArray } from 'src/enum';

export class CounterBotUserHistoryDto {
  @IsString()
  @IsNotEmpty()
  @IsEnum(BotUserGameResult, {
    message: `Bot result should be one of this: [${[...botUserGameResultArray]}]`,
  })
  result: string;
}
