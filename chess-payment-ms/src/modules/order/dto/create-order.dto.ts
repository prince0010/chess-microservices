import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  ValidateNested,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateOrderDto {
  @IsPositive()
  @IsNumber()
  @IsNotEmpty()
  userUid: number;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  id: number;
}

export class OrderItemDto {
  @IsNumber()
  @IsPositive()
  itemId: number;

  @IsNumber()
  @IsPositive()
  quantity: number;
}
