export interface ICountAndListWorldChessChampionLevels {
  currentPage: number;
  total: number;
  levels: IWorldChessChampionLevel[];
}

export interface IWorldChessChampionLevel {
  id: number;
  level: string;
  timesHasBeenCompleted: number;
  disabled: boolean;
}
