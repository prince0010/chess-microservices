import { PartialType } from '@nestjs/mapped-types';

export class CreateTetrisDto {}

export class UpdateTetrisDto extends PartialType(CreateTetrisDto) {}
