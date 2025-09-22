export enum PandaState {
  HAPPY = 'happy',
  HUNGRY = 'hungry',
  DIRTY = 'dirty',
  SLEEPY = 'sleepy',
  NEGLECTED = 'neglected',
}

export enum PandaFunction {
  ADD_EXTRA_LIFE = 'Add extra life',
  ADD_EXTRA_TIME = 'Add extra time',
  SPEND_EXTRA_LIFE = 'Spend extra life',
  SPEND_EXTRA_TIME = 'Spend extra time',
}

export enum PandaAction {
  FEED = 'feed',
  SLEEP = 'sleep',
  BATH = 'bath',
}

export const pandaActionsArray = [
  PandaAction.FEED,
  PandaAction.SLEEP,
  PandaAction.BATH,
];
