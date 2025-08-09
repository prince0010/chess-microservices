export interface ICountAndListLessonParents {
  currentPage: number;
  total: number;
  parents: ILessonParent[];
}

export interface ILessonParent {
  id: number;
  lessonFactor: number;
  level: string;
  levelFrontend: string;
  pointsPerLesson: number;
  quantityToUnlockNext: number;
  timer: number;
  name: string;
  story: string;
  lessonsCompleted: number;
  lessonsLength: number;
  isTest: boolean;
  isBot: boolean;
  isGame: boolean;
  isPreview: boolean;
  disabled: boolean;
  messageModal: string | null;
  canBeSkipped: boolean;
}

export interface ILessonParentDetail {
  id: number;
  lessonFactor: number;
  level: string;
  timer: number;
  name: string;
  pointsPerLesson: number;
  quantityToUnlockNext: number;
  levelFrontend: string;
  story: string;
  showHint: boolean;
  isTest: boolean;
  isBot: boolean;
  isGame: boolean;
  isPreview: boolean;
  canBeSkipped: boolean;
  lessonsCompleted: number;
  lessonsLength: number;
  lessons: ILessonList[];
  lastLessonPlayedId: number | null;
}

export interface ILessonList {
  id: number;
  level: string;
  timer: number;
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
  nextLessonParentId: number | null;
  nextLessonParentDisabled: boolean;
  lastPoints: number;
  earnedPoints: number;
  counter: number;
}
