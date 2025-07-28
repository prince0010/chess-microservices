export enum LessonLevel {
  LEVEL_1 = 'Level 1',
  LEVEL_2 = 'Level 2',
  LEVEL_3 = 'Level 3',
  LEVEL_4 = 'Level 4',
  LEVEL_5 = 'Level 5',
  LEVEL_6 = 'Level 6',
  LEVEL_7 = 'Level 7',
  LEVEL_8 = 'Level 8',
  LEVEL_9 = 'Level 9',
  LEVEL_10 = 'Level 10',
  LEVEL_11 = 'Level 11',
  LEVEL_12 = 'Level 12',
  LEVEL_13 = 'Level 13',
  LEVEL_14 = 'Level 14',
}

export const lessonLevelsArray = [
  LessonLevel.LEVEL_1,
  LessonLevel.LEVEL_2,
  LessonLevel.LEVEL_3,
  LessonLevel.LEVEL_4,
  LessonLevel.LEVEL_5,
  LessonLevel.LEVEL_6,
  LessonLevel.LEVEL_7,
  LessonLevel.LEVEL_8,
  LessonLevel.LEVEL_9,
  LessonLevel.LEVEL_10,
  LessonLevel.LEVEL_11,
  LessonLevel.LEVEL_12,
  LessonLevel.LEVEL_13,
  LessonLevel.LEVEL_14,
];

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
  TEST_LEVEL_11 = 'test 11',
  TEST_LEVEL_12 = 'test 12',
  TEST_LEVEL_13 = 'test 13',
  TEST_LEVEL_14 = 'test 14',
}

export enum LessonStoryName { // this enum separate the complexity of lessons on road-map
  EDUCATION = 'Education',
  PUZZLE = 'Puzzle',
  ENDGAME = 'Endgame',
  BOTGAME = 'Botgame',
}
