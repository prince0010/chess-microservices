import { PartialType } from '@nestjs/mapped-types';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { BotDifficulty, botDifficultyArray, Gender } from 'src/enum';

export class CreateBotDto {
  @IsString()
  @IsNotEmpty()
  @IsEnum(BotDifficulty, {
    message: `Bot difficulty should be one of this: [${[...botDifficultyArray]}]`,
  })
  difficulty: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(Gender, {
    message: `The available genders for bots are these one: [${Object.values(Gender)}]`,
  })
  gender: string;

  @IsNumber()
  @IsPositive()
  @Min(50)
  @Max(3300)
  elo: number;

  @IsString()
  @IsOptional()
  avatar?: string; // file image

  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateBotDto extends PartialType(CreateBotDto) {
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
