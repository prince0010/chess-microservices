import { IsOptional, IsString } from 'class-validator';

export class TargetLanguageDto {
  @IsOptional()
  @IsString()
  targetLanguage: string;
}
