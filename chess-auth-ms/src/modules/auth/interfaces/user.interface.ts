export interface ICountAndListUsers {
  total: number;
  page: number;
  users: IOneUser[];
}
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

export interface ISubtractPointsUser {
  lastPoints: number;
  spentPoints: number;
  counter: number; // lastPoints - spentPoints
}

export interface IUserUidsArray {
  uids: number[];
}
