export interface IPaymentSessionStripeResponse {
  cancelUrl: string;
  successUrl: string;
  url: string;
}

export interface IPaymentInAppPurchaseResponse {
  success: boolean;
  orderId: string;
}
