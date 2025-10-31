export enum ItemType {
  PANDA_POINTS = 'PANDA_POINTS',
  LEVELS_UNLOCK = 'LEVELS_UNLOCK',
  SUBSCRIPTION = 'SUBSCRIPTION',
  FEATURE_UNLOCK = 'FEATURE_UNLOCK',
  BOOSTER = 'BOOSTER',
}

export enum SubscriptionTier {
  BASIC = 'BASIC',
  PREMIUM = 'PREMIUM',
  ALL_ACCESS = 'ALL_ACCESS',
}

export enum ItemPackage {
  ONE_MILLION_PANDA_POINTS = '1 Million Panda points',
  OPEN_ALL_LEVELS_FOR_30_DAYS = 'All Levels Unlocked - 30 Days',
  OPEN_ALL_LEVELS_FOR_LIFE_TIME = 'All Levels Unlocked - Life Time',
  // at the moment only 3 packages, add more here in case is needed in future
}

export enum ItemPlatform {
  ITEM_FOR_APP = 'APP',
  ITEM_FOR_WEBSITE = 'WEBSITE',
}

/*
1) 9.90 USD-1Million Panda points 
2) 9.90 USD-open all levels for 30 days 
3)74.90 USD open all levels for life time
*/
