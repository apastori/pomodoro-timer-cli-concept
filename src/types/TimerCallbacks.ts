import { SessionTypeType } from './SessionTypeType';

export interface TimerCallbacks {
  onTick?: (timeRemaining: number, sessionType: SessionTypeType) => void;
  onSessionComplete?: (sessionType: SessionTypeType, nextSession: SessionTypeType) => void;
}