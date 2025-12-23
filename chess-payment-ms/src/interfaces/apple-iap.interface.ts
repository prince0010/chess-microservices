/*
    transactionId: '2000001085307874',
    originalTransactionId: '2000001085307874',
    bundleId: 'com.wechess.app',
    productId: 'com.wechess.unlock.lifetime',
    purchaseDate: 1766038941000,
    originalPurchaseDate: 1766038941000,
    quantity: 1,
    type: 'Non-Consumable',
    deviceVerification: 'zUxWL49n3ewoDEak2RjNKxWIkV3QC9pZi3K45xyU0x59yBhGS7htloVGRhWf5rUk',
    deviceVerificationNonce: 'a8d3648e-4020-4782-91a1-eac6832a9112',
    inAppOwnershipType: 'PURCHASED',
    signedDate: 1766073401246,
    environment: 'Sandbox',
    transactionReason: 'PURCHASE',
    storefront: 'CRI',
    storefrontId: '143495',
    price: 74900,
    currency: 'USD',
    appTransactionId: '705117304493438845'
*/

export interface IAppleIapClientSideRequest {
  transactionId: string;
  originalTransactionId: string;
  bundleId: string;
  productId: string;
  purchaseDate: number; // maybe date
  originalPurchaseDate: number; // maybe date
  quantity: number;
  type: string;
  deviceVerification: string;
  deviceVerificationNonce: string;
  inAppOwnershipType: string;
  signedDate: number; // maybe date
  environment: string;
  transactionReason: string;
  storefront: string;
  storefrontId: string;
  price: number;
  currency: string;
  appTransactionId: string;
}
