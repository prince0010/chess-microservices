export interface ICountAndListLessons {
  currentPage: number;
  total: number;
  lessons: ILessonsList[];
}

export interface ILessonsList {
  id: number;
  level: string;
  description: string;
  moves: string[];
  pgnRaw: string;
  fen: string;
  points: number;
  event: string;
  site: string;
  date: string;
  round: string;
  white: string;
  black: string;
  result: string;
  setup: string;
  plyCount: number;
  isCompleted: boolean;
}
