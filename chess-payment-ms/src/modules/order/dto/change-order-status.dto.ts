import { IsEnum, IsUUID } from 'class-validator';
import { OrderStatus } from 'src/enum';

export class ChangeOrderStatusDto {
  @IsUUID(4) // version of uuid
  id: string;

  @IsEnum(OrderStatus, {
    message: 'Invalid order status',
  })
  status: OrderStatus;
}
