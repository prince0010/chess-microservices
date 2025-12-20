import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { StorePlatform } from 'src/enum';

export class CreateOrderAppDto {
  @IsPositive()
  @IsNumber()
  @IsNotEmpty()
  userUid: number;

  @IsString()
  storeChargeId: string;

  @IsNotEmpty()
  @IsEnum(StorePlatform)
  source: StorePlatform;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}

export class UpdateOrderDto extends PartialType(CreateOrderAppDto) {
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
