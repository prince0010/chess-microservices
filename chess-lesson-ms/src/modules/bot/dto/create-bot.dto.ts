import { PartialType } from '@nestjs/mapped-types';

export class CreateBotDto {}

export class UpdateBotDto extends PartialType(CreateBotDto) {
  id: number;
}
