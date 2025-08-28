export interface ICountAndListTeachers {
  total: number;
  page: number;
  users: IOneTeacher[];
}
export interface IOneTeacher {
  uid: number;
  name: string;
  username: string;
  country: string;
  gender: string;
  birthday: Date | null;
  isActive: boolean;
}
