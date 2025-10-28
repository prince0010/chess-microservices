import { PartialType } from '@nestjs/mapped-types';

export class CreateItemDto {}

export class UpdateItemDto extends PartialType(CreateItemDto) {
  id: number;
}
