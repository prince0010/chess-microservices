export enum LessonParentTestName {
  TEST_LEVEL_1 = 'test 1',
  TEST_LEVEL_2 = 'test 2',
  TEST_LEVEL_3 = 'test 3',
  TEST_LEVEL_4 = 'test 4',
  TEST_LEVEL_5 = 'test 5',
  TEST_LEVEL_6 = 'test 6',
  TEST_LEVEL_7 = 'test 7',
  TEST_LEVEL_8 = 'test 8',
  TEST_LEVEL_9 = 'test 9',
  TEST_LEVEL_10 = 'test 10',
}

export enum LessonParentName {
  // Level 1
  PAWN = 'pawn',
  KING = 'king',
  BISHOP = 'bishop',
  KNIGHT = 'knight',
  ROOK = 'rook',
  QUEEN = 'queen',
  TEST_LEVEL_1 = 'test 1',
  // Level 2
  LEVEL_2 = 'level 2',
  TEST_LEVEL_2 = 'test 2',
  // Level 3
  LEVEL_3 = 'Mate in One',
  TEST_LEVEL_3 = 'test 3',
  // Level 4
  LEVEL_4 = 'Winning combination',
  TEST_LEVEL_4 = 'test 4',
  // Level 5
  LEVEL_5 = 'Great moves',
  TEST_LEVEL_5 = 'test 5',
  // Level 6
  LEVEL_6 = 'Master of the motives',
  TEST_LEVEL_6 = 'test 6',
  // Level 7
  LEVEL_7 = 'The wizard',
  TEST_LEVEL_7 = 'test 7',
  // Level 8
  LEVEL_8 = 'Big brain',
  TEST_LEVEL_8 = 'test 8',
  // Level 9
  LEVEL_9 = 'Mastermind solver',
  TEST_LEVEL_9 = 'test 9',
  // Level 10
  LEVEL_10 = 'ASAP',
  TEST_LEVEL_10 = 'test 10',
  // Level 11
  LEVEL_11 = 'The master of studies',
  TEST_LEVEL_11 = 'test 11',
  // Level 12
  LEVEL_12 = 'The boss',
  TEST_LEVEL_12 = 'test 12',
}

export enum LessonFilename {
  PAWN = 'Level_1_Pawn.pgn',
  KING = 'Level_1_King.pgn',
  BISHOP = 'Level_1_Bishop.pgn',
  KNIGHT = 'Level_1_Knight.pgn',
  ROOK = 'Level_1_Rook.pgn',
  QUEEN = 'Level_1_Queen.pgn',
  LEVEL_2 = 'Level_2.pgn',
  LEVEL_3 = 'Level_3.pgn',
  LEVEL_4 = 'Level_4_Puzzle_Winning_combination.pgn',
  LEVEL_5 = 'Level_5_Puzzle_Great_moves.pgn',
  LEVEL_6 = 'Level_6_Puzzle_Master_of_the_motives.pgn',
  LEVEL_7 = 'Level_7_Puzzle_The_wizard.pgn',
  LEVEL_8 = 'Level_8_Puzzle_Big_brain.pgn',
  LEVEL_9 = 'Level_9_Puzzle_Mastermind_solver.pgn',
  LEVEL_10 = 'Level_10_Puzzle_Asap.pgn',
  LEVEL_11 = 'Level_11_Puzzle_The_master_of_studies.pgn',
  LEVEL_12 = 'Level_12_Puzzle_The_boss.pgn',
}

export enum LessonStoryName { // this enum separate the complexity of lessons on road-map
  EDUCATION = 'Education',
  PUZZLE = 'Puzzle',
  ENDGAME = 'Endgame',
  BOTGAME = 'Botgame',
}

export enum LessonTimer {
  STORY_EDUCATION = 30,
  STORY_PUZZLE_WINNING_COMBINATION = 30,
  STORY_PUZZLE_GREAT_MOVES = 30,
  STORY_PUZZLE_MASTER_OF_THE_MOTIVES = 30,
  STORY_PUZZLE_THE_WIZARD = 45,
  STORY_PUZZLE_BIG_BRAIN = 45,
  STORY_PUZZLE_MASTER_MIND_SOLVER = 60,
  STORY_PUZZLE_ASAP = 60,
  STORY_PUZZLE_THE_MASTER_OF_STUDIES = 90,
  STORY_PUZZLE_THE_BOSS = 90,
}
