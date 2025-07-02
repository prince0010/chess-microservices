import { Bot } from '../entities/bot.entity';

export interface ICountAndListBots {
  currentPage: number;
  total: number;
  bots: IBotWithHistoryByUser[];
}

export interface IBotWithHistoryByUser {
  id: number;
  name: string;
  gender: string;
  difficulty: string;
  description?: string;
  isActive: boolean;
  elo: number;
  gameWon: number;
  gameLost: number;
  gameTied: number;
}

export interface GameBotResponse {
  message: string;
  lastPoints: number;
  earnedPoints: number;
  counter: number;
}

/* Bot Games Record Endpoints */
export interface ICountAndListBotRecordGames {
  currentPage: number;
  total: number;
  games: IBotRecordGameByUser[];
}
export interface IBotRecordGameByUser {
  id: number;
  bot: Bot;
  moves: string[];
  pgn: string;
  whitePlayer: string;
  blackPlayer: string;
  result: string;
  datePlayed: Date;
  event: string;
  site: string;
  setup: string;
  plyCount: number;
  currentFen?: string;
  isGameFinished: boolean;
}
