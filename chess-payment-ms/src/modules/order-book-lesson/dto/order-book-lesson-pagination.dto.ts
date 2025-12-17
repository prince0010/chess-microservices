import { Type } from 'class-transformer';
import { IsEnum, IsOptional, IsPositive, Min } from 'class-validator';
import { OrderStatus } from 'src/enum';

export class OrderBookLessonPaginationDto {
  @IsOptional()
  @IsPositive()
  @Type(() => Number) // converts query parameter string to number here
  limit?: number;

  @IsOptional()
  @Min(1)
  @Type(() => Number) // converts query parameter string to number here
  page?: number;

  @IsOptional()
  @IsEnum(OrderStatus, {
    message: 'Invalid order status',
  })
  status?: OrderStatus;
}
