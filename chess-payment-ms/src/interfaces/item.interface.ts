export interface IItemSeed {
  currency: string;
  name: string;
  description: string;
  price: number;
  isActive: boolean;
  type: string;
  storeProductId?: string; // new prop to identify apple and google id
  pointsAmount?: number;
  subscriptionTier?: string;
  durationDays?: number;
}
