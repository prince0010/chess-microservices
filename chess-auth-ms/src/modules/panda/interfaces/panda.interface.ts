import { AuthPanda } from '../entities/auth-panda.entity';

export interface PandaActionResponse {
  message: string;
  lastPoints: number;
  spentPoints: number;
  counter: number;
  panda: AuthPanda;
}

export interface PandaFunctionResponse extends PandaActionResponse {
  extraLive: number;
  extraTime: number;
}
