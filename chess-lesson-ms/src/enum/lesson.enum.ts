export enum LessonParentName {
  // Level 1
  PAWN = 'pawn',
  KING = 'king',
  BISHOP = 'bishop',
  KNIGHT = 'knight',
  ROOK = 'rook',
  QUEEN = 'queen',
}

export enum LessonStoryName { // this enum separate the complexity of lessons on road-map
  EDUCATION = 'Education',
  PUZZLE = 'Puzzle',
  ENDGAME = 'Endgame',
  BOTGAME = 'Botgame',
}

export enum LessonNameAsGame {
  TETRIS_GAME = 'Tetris game',
  GUESS_SQUARE_GAME = 'Guess the square game',
  RIGHT_PIECE_ON_RIGHT_SQUARE_GAME = 'Right piece on right square game',
  MEMORY_TESTER_GAME = 'Memory tester game', // world chess champions
}

export enum LessonNameAsBot {
  DEFEAT_TO_TIK_AND_SHELLY = 'Defeat to Tik and Shelly',
}

export enum LessonSingleRecordStatus {
  SUCCEEDED = 'SUCCEEDED',
  FAILED = 'FAILED',
}
