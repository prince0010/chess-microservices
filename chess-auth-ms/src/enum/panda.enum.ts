export enum PandaState {
  HAPPY = 'happy',
  HUNGRY = 'hungry',
  DIRTY = 'dirty',
  SLEEPY = 'sleepy',
  NEGLECTED = 'neglected',
}

export enum PandaAction {
  FEED = 'feed',
  SLEEP = 'sleep',
  BATH = 'bath',
}

export enum PandaFunction {
  ADD_EXTRA_LIFE = 'Add extra life',
  ADD_EXTRA_TIME = 'Add extra time',
  SPEND_EXTRA_LIFE = 'Spend extra life',
  SPEND_EXTRA_TIME = 'Spend extra time',
}

export const pandaActionsArray = [
  PandaAction.FEED,
  PandaAction.SLEEP,
  PandaAction.BATH,
];

export enum PandaPointsConsumedByAction {
  POINTS_BY_FEED = 10,
  POINTS_BY_SLEEP = 10,
  POINTS_BY_BATH = 10,
}
