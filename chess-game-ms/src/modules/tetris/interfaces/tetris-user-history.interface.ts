export interface BestScoreByUserResponse {
  bestScore: number;
}

export interface IRankingResponse {
  userUid: number;
  ranking: IRankingResult[];
}

export interface IRankingResult {
  userUid: number;
  bestScore: number;
  userName: string;
  position: number;
}
