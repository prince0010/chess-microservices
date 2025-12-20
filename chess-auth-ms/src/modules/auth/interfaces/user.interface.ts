export interface ICountAndListUsers {
  total: number;
  page: number;
  users: IOneUser[];
}

export interface ICountAndListStudents {
  total: number;
  page: number;
  students: IOneUser[];
}
export interface IOneUser {
  uid: number;
  name: string;
  username: string;
  country?: string;
  gender: string;
  birthday: Date | null;
  roles: string[];
  isActive: boolean;
  points: number;
  totalScore: number;
  educationPoints: number;
  puzzlePoints: number;
  endgamesPoints: number;
  animalPoints: number;
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

// this interface is from auth validation in gateway
export interface ICurrentUser {
  uid: number;
  name: string;
  username: string; // or email, it is the same
  country?: string;
  roles: string[];
  age?: number;
  gender?: string;
}
