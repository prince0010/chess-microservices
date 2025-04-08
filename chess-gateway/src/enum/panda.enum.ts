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

export const pandaActionsArray = [
  PandaAction.FEED,
  PandaAction.SLEEP,
  PandaAction.BATH,
];
