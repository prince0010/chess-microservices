import { WorldChessChampionGame } from '../entities/world-chess-champion-game.entity';

export interface IFindOneWorldChessChampionLevelResponse {
  id: number;
  level: string;
  game: WorldChessChampionGame;
  points: number;
  timesHasBeenCompleted: number;
}
