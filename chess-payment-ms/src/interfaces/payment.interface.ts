import { Item } from 'src/modules/item/entities/item.entity';

export interface IPaymentSessionStripeResponse {
  cancelUrl: string;
  successUrl: string;
  url: string;
}

export interface IPaymentInAppPurchaseResponse {
  success: boolean;
  orderId?: string;
  item?: Item;
  errorMessage?: string;
  alreadyProcessed: boolean;
}
