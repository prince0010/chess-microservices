export enum ItemType {
  PANDA_POINTS = 'PANDA_POINTS',
  LEVELS_UNLOCK = 'LEVELS_UNLOCK',
  SUBSCRIPTION = 'SUBSCRIPTION',
  FEATURE_UNLOCK = 'FEATURE_UNLOCK',
  BOOSTER = 'BOOSTER',
}

export enum IapStoreProductId {
  PANDA_1M = 'com.wechess.panda.1m',
  UNLOCK_30DAYS = 'com.wechess.unlock.30days',
  UNLOCK_LIFETIME = 'com.wechess.unlock.lifetime',
}

export enum SubscriptionTier {
  BASIC = 'BASIC',
  PREMIUM = 'PREMIUM',
  ALL_ACCESS = 'ALL_ACCESS',
}

export enum ItemPackage {
  ONE_MILLION_PANDA_POINTS = 'ONE_MILLION_PANDA_POINTS_TITLE',
  OPEN_ALL_LEVELS_FOR_30_DAYS = 'OPEN_ALL_LEVELS_FOR_30_DAYS_TITLE',
  OPEN_ALL_LEVELS_FOR_LIFE_TIME = 'OPEN_ALL_LEVELS_FOR_LIFE_TIME_TITLE',
  // at the moment only 3 packages, add more here in case is needed in future
}

export enum ItemDescription {
  ONE_MILLION_PANDA_POINTS_DESCRIPTION = 'ONE_MILLION_PANDA_POINTS_DESCRIPTION',
  OPEN_ALL_LEVELS_FOR_30_DAYS_DESCRIPTION = 'OPEN_ALL_LEVELS_FOR_30_DAYS_DESCRIPTION',
  OPEN_ALL_LEVELS_FOR_LIFE_TIME_DESCRIPTION = 'OPEN_ALL_LEVELS_FOR_LIFE_TIME_DESCRIPTION',
  // at the moment only 3 descriptions, add more here in case is needed in future
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
