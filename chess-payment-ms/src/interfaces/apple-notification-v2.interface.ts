export interface AppleServerNotificationV2 {
  notificationType: string; // 'ONE_TIME_CHARGE'
  data: {
    environment: 'Sandbox' | 'Production';
    appAppleId: number;
    bundleId: string;
    signedTransactionInfo?: string;
    signedRenewalInfo?: string;
  };
}

export interface AppleTransactionInfoV2 {
  type: string;
  productId: string;
  appAccountToken: string;
  transactionId: string;
  currency: string;
  purchaseDate: number;
  price: number;
  storefront: string;
  originalTransactionId: string;
  bundleId: string;
  originalPurchaseDate: number;
  quantity: number;
  inAppOwnershipType: string;
  signedDate: number;
  environment: string;
  transactionReason: string;
  appTransactionId: string;
}
