export interface IRankingResponse {
  currentPosition: number;
  top100: IRankingResult[];
}

export interface IRankingResult {
  userUid: number;
  position: number;
  username: string;
  score: number;
}
