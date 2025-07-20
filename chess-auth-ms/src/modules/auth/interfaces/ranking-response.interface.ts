export interface IRankingResponse {
  currentUserUid: number;
  currentUsername: string;
  currentPosition: number;
  currentScore: number;
  top100: IRankingResult[];
}

export interface IRankingResult {
  userUid: number;
  position: number;
  username: string;
  score: number;
}
