import { ILessonList } from './lesson.interface';

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

export interface ISingleLessonTestRecord {
  id: number;
  level: string;
  name: string;
  playedAt: Date;
  result: string;
  lessons: ISingleChildLessonPuzzle[]; // Lesson with moves as array
}

export interface ISingleChildLessonPuzzle extends ILessonList {
  isFailure: boolean; // to know if the lesson was failed or not
}
