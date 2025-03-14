import { Bot } from '../entities/bot.entity';

export interface ICountAndListBots {
  currentPage: number;
  total: number;
  bots: Bot[];
}
