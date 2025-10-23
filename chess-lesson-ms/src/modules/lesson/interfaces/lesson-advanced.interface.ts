import { LessonAdvanced } from '../entities/lesson-advanced.entity';

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
  fenBefore: string;
  variations: AdvancedMovesTree[][];
}
