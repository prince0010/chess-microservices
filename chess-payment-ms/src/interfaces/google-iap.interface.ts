/*
    {
        purchaseTimeMillis: '1766851197691',
        purchaseState: 0,
        consumptionState: 1,
        developerPayload: '',
        orderId: 'GPA.3376-4782-1452-37161',
        purchaseType: 0,
        acknowledgementState: 1,
        kind: 'androidpublisher#productPurchase',
        obfuscatedExternalAccountId: 'e62a013b-e329-4870-b519-bcba9bd25572',
        regionCode: 'CR'
    }
*/

export interface IGoogleIapClientSideRequest {
  purchaseTimeMillis: string;
  purchaseState: number;
  consumptionState: number;
  developerPayload: string;
  orderId: string;
  purchaseType: number;
  acknowledgementState: number;
  kind: string;
  obfuscatedExternalAccountId: string;
  regionCode: string;
}
