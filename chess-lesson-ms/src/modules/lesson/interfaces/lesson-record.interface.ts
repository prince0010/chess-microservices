/* Normal lessons */
export interface ILessonListRecordByUser {
  total: number;
  lessons: IShortRecordLessonsByUser[];
}
export interface IShortRecordLessonsByUser {
  lessonId: number;
  level: string;
  description: string;
  completedAt: Date;
}

/* Test lessons */
export interface ILessonTestRecordListByUser {
  total: number;
  page: number;
  records: ILessonTestRecord[];
}
export interface ILessonTestRecord {
  id: number;
  level: string;
  name: string;
  playedAt: Date;
  lessonIds: string[];
  result: string;
}
