import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';
import { PandaAction, pandaActionsArray, PandaFunction } from 'src/enum';

export class UpdatePandaDto {
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  userUid: number;

  @IsNotEmpty()
  @IsString()
  @IsEnum(PandaAction, {
    message: `Panda action must be one of these enum values: [${[...pandaActionsArray]}]`,
  })
  action: string;
}

export class UpdatePandaFunctionDto {
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  userUid: number;

  @IsNotEmpty()
  @IsString()
  @IsEnum(PandaFunction, {
    message: `Panda function must be one of these enum values: [${[...Object.values(PandaFunction)]}]`,
  })
  function: string;
}
