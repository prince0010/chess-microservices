export enum BotDifficulty {
  BEGINNER = 'Students of the game',
  CASUAL = 'Casual player',
  INTERMEDIATE = 'Top club player',
  MASTER = 'Professional chess player',
  GRAND_MASTER = 'Best of the best',
}

export const ELO_RANGE: Record<BotDifficulty, { min: number; max: number }> = {
  [BotDifficulty.BEGINNER]: { min: 50, max: 750 },
  [BotDifficulty.CASUAL]: { min: 800, max: 1800 },
  [BotDifficulty.INTERMEDIATE]: { min: 2000, max: 2200 },
  [BotDifficulty.MASTER]: { min: 2300, max: 2400 },
  [BotDifficulty.GRAND_MASTER]: { min: 2500, max: 2700 },
};

export const botDifficultyArray = [
  BotDifficulty.BEGINNER,
  BotDifficulty.CASUAL,
  BotDifficulty.INTERMEDIATE,
  BotDifficulty.MASTER,
  BotDifficulty.GRAND_MASTER,
];

export enum BotUserGameResult {
  GAME_WON = 'game_won',
  GAME_LOST = 'game_lost',
  GAME_TIED = 'game_tied',
}

export const botUserGameResultArray = [
  BotUserGameResult.GAME_WON,
  BotUserGameResult.GAME_LOST,
  BotUserGameResult.GAME_TIED,
];

export enum GameResult {
  WHITE_WINS = '1-0',
  BLACK_WINS = '0-1',
  DRAW = '1/2-1/2',
  UNFINISHED = '*',
}
