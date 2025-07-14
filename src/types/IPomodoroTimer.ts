import type { TimerStateType } from './TimerStateType';
import type { SessionTypeType } from './SessionTypeType';

export interface IPomodoroTimer {
  start(): void;
  pause(): void;
  stop(): void;
  reset(): void;
  onTickCallback(callback: (timeRemaining: number, sessionType: SessionTypeType) => void): void;
  onSessionCompleteCallback(callback: (sessionType: SessionTypeType, nextSession: SessionTypeType) => void): void;
  getState(): TimerStateType;
  getCurrentSession(): SessionTypeType;
  getTimeRemaining(): number;
  getSessionCount(): number;
}