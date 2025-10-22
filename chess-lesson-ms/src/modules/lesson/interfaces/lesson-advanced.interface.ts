import { LessonAdvanced } from '../entities/lesson-advanced.entity';

export interface ICountAndListAdvancedLessons {
  page: number;
  total: number;
  advancedLessons: LessonAdvanced[];
}

export interface ParsedAdvancedLesson {
  filename: string;
  pgnRaw: string;
  description: string;
}

// export interface MetadataAdvancedLesson {
//   event: string;
//   site: string;
//   date: string;
//   round: string;
//   white: string;
//   black: string;
//   result: string;
//   eco: string;
//   annotator: string;
//   plyCount: number;
// }

// export interface AdvancedMovesTree {
//   // Your target output structure
//   fenBefore: string;
//   moveNumber: number | null;
//   color: 'w' | 'b' | null;
//   move: string;
//   nags: string[];
//   comments: string[];
//   variations: AdvancedMovesTree[][];
// }
