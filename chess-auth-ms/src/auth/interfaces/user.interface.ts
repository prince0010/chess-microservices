export interface IOneUser {
  uid: number;
  name: string;
  username: string;
  country: string;
  gender: string;
  birthday: Date | null;
  roles: string[];
  isActive: boolean;
  points: number;
}

export interface IUpdatedPointsUser {
  lastPoints: number;
  earnedPoints: number;
  counter: number; // lastPoints + earnedPoints
}
