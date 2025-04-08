import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { PandaAction, pandaActionsArray } from 'src/enum';

export class UpdatePandaDto {
  @IsNotEmpty()
  @IsString()
  @IsEnum(PandaAction, {
    message: `Panda action must be one of these enum values: [${[...pandaActionsArray]}]`,
  })
  action: string;
}
