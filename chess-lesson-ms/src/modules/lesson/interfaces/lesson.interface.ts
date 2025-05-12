export interface ICountAndListLessonParents {
  currentPage: number;
  total: number;
  parents: ILessonParent[];
}

export interface ILessonParent {
  id: number;
  level: string;
  name: string;
  lessonsCompleted: number;
  lessonsLength: number;
  disabled: boolean;
}

export interface ILessonParentDetail {
  id: number;
  level: string;
  name: string;
  showHint: boolean;
  lessonsCompleted: number;
  lessonsLength: number;
  lessons: ILessonList[];
}

export interface ILessonList {
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
  showHint: boolean;
  hints?: ILessonHint;
}

export interface ILessonHint {
  squares?: string[]; // ['e4']
  arrows?: string[]; // ['e2e4']
}

export interface CompleteLessonResponse {
  message: string;
  lastPoints: number;
  earnedPoints: number;
  counter: number;
}
