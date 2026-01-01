export interface IEmailAppleIapReceivedData {
  packageName: string;
  packagePrice: number;
  userUid: number; // then find username by this userUid
}

export interface IEmailAppleIapReceivedPayload {
  packageName: string;
  packagePrice: number;
  customerName: string;
  customerUsername: string;
}
