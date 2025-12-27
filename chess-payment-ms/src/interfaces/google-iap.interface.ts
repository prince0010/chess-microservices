/*
    {
        "kind": "androidpublisher#productPurchase",
        "purchaseTimeMillis": "1735235232000",
        "purchaseState": 0, 
        "consumptionState": 0,
        "developerPayload": "",
        "orderId": "GPA.3333-4444-5555-66666",
        "purchaseType": 0,
        "acknowledgementState": 0,
        "productId": "com.wechess.panda.1m.v2",
        "obfuscatedExternalAccountId": "your-order-uid-if-passed-from-app",
        "regionCode": "US"
    }
*/

export interface IGoogleIapClientSideRequest {
  kind: string;
  purchaseTimeMillis: string;
  purchaseState: number;
  consumptionState: number;
  developerPayload: string;
  orderId: string;
  purchaseType: number;
  acknowledgementState: number;
  productId: string;
  obfuscatedExternalAccountId: string;
  regionCode: string;
}
