export interface ICountAndListBots {
  currentPage: number;
  total: number;
  bots: IBotWithHistoryByUser[];
}

export interface IBotWithHistoryByUser {
  id: number;
  name: string;
  difficulty: string;
  description?: string;
  isActive: boolean;
  elo: number;
  gameWon: number;
  gameLost: number;
  gameTied: number;
}
