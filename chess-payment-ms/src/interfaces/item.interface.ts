export interface IItemSeed {
  currency: string;
  name: string;
  description: string;
  price: number;
  isActive: boolean;
  type: string;
  pointsAmount?: number;
  subscriptionTier?: string;
  durationDays?: number;
}
