import { IsEnum, IsString } from 'class-validator';

import { FilenameSeedWorldChessChampion } from 'src/enum';

export class RunFileSeedWorldChessChampionDto {
  @IsString()
  @IsEnum(FilenameSeedWorldChessChampion, {
    message: `Filename seed to generate World Chess Champion games must be one of the following names: [${Object.values(FilenameSeedWorldChessChampion)}]`,
  })
  filename: string;
}
