export enum OrderStatus {
  PENDING = 'PENDING',
  DELIVERED = 'DELIVERED',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED',
}

export enum OrderVerificationStatus {
  UNVERIFIED = 'UNVERIFIED',
  VERIFIED_CLIENT_SIDE = 'VERIFIED_CLIENT_SIDE', // iap verified on customer device
  VERIFIED_SERVER_SIDE = 'VERIFIED_SERVER_SIDE', // iap verified on server to server with apple/google
}

export enum StorePlatform {
  GOOGLE_PLAY_STORE = 'google_play',
  APPLE_APP_STORE = 'app_store',
}
