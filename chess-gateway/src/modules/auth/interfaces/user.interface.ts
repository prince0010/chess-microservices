export interface ICurrentUser {
  uid: number;
  name: string;
  username: string; // or email, it is the same
  country?: string;
  role: string[];
  age?: number;
  gender?: string;
}
