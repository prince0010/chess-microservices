import { ItemDescription, ItemPackage, ItemType } from 'src/enum';
import { IItemSeed } from 'src/interfaces';

// List Packages
export const listItems: IItemSeed[] = [
  // Panda Points
  {
    name: ItemPackage.ONE_MILLION_PANDA_POINTS,
    description: ItemDescription.ONE_MILLION_PANDA_POINTS_DESCRIPTION,
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
    description: ItemDescription.OPEN_ALL_LEVELS_FOR_30_DAYS_DESCRIPTION,
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
    description: ItemDescription.OPEN_ALL_LEVELS_FOR_LIFE_TIME_DESCRIPTION,
    price: 74.9,
    currency: 'USD',
    type: ItemType.LEVELS_UNLOCK,
    pointsAmount: null,
    durationDays: 100 * 365,
    subscriptionTier: null,
    isActive: true,
  },
];
