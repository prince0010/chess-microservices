export interface ICountAndListAdvancedLessons {
  page: number;
  total: number;
  advancedLessons: any[];
}

export interface ParsedAdvancedLesson {
  filename: string;
  pgnRaw: string;
  metadata: MetadataAdvancedLesson;
  movesTree: any;
  description: string;
}

export interface MetadataAdvancedLesson {
  event: string;
  site: string;
  date: string;
  round: string;
  white: string;
  black: string;
  fen: string;
  result: string;
  eco: string;
  annotator: string;
  plyCount: number;
}

export interface AdvancedMovesTree {
  moveNumber: number;
  color: 'w' | 'b';
  move: string;
  nags: string[];
  comments: string[];
  invalidDuringParse: boolean; // optionally expose a flag to identify parsing/application issues
  fenBefore: string;
  variations: AdvancedMovesTree[][];
}

/* IAdvancedLessonSeed List */
export interface IAdvancedLessonSeed {
  filename: string;
  name: string;
  folder: string;
}
