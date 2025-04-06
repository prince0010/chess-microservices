export enum BotDefaultFormula {
  K_FACTOR = 0.13,
  GAME_WON = 1,
  GAME_TIED = 0.5,
}

// Formula botPoints = elo * K_FACTOR * (GAME_WON || GAME_TIED)
