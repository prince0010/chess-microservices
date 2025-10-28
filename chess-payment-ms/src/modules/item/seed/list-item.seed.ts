import { ItemPackage, ItemType } from 'src/enum';
import { IItemSeed } from 'src/interfaces';

// List Packages
export const listItems: IItemSeed[] = [
  // Panda Points
  {
    name: ItemPackage.ONE_MILLION_PANDA_POINTS,
    description: 'Get 1,000,000 Panda points to use in-game',
    price: 9.9,
    currency: 'USD',
    type: ItemType.PANDA_POINTS,
    pointsAmount: 1000000,
    subscriptionTier: null,
    durationDays: null,
    isActive: true,
  },

  // Levels Unlock
  {
    name: ItemPackage.OPEN_ALL_LEVELS_FOR_30_DAYS,
    description: 'Access to all levels for 30 days',
    price: 9.9,
    currency: 'USD',
    type: ItemType.LEVELS_UNLOCK,
    pointsAmount: null,
    durationDays: 30,
    subscriptionTier: null,
    isActive: true,
  },
  {
    name: ItemPackage.OPEN_ALL_LEVELS_FOR_LIFE_TIME,
    description: 'Access to all levels for life time',
    price: 74.9,
    currency: 'USD',
    type: ItemType.LEVELS_UNLOCK,
    pointsAmount: null,
    durationDays: 100 * 365,
    subscriptionTier: null,
    isActive: true,
  },
];
