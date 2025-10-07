export interface ParsedAdvancedLesson {
  filename: string;
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
  // Your target output structure
  moveNumber: number | null;
  color: 'w' | 'b' | null;
  move: string;
  nags: string[];
  comments: string[];
  variations: AdvancedMovesTree[][];
}
