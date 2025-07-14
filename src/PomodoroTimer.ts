import { TimerState } from './TimerState';
import { SessionType } from './SessionType';
import type { TimerStateType } from './types/TimerStateType';
import type { SessionTypeType } from './types/SessionTypeType';
import type { PomodoroConfig } from './types/PomodoroConfig';
import type { IPomodoroTimer } from './types/IPomodoroTimer';

export class PomodoroTimer implements IPomodoroTimer {
  private config: PomodoroConfig;
  private state: TimerStateType = TimerState.STOPPED;
  private currentSession: SessionTypeType = SessionType.WORK;
  private sessionCount = 0;
  private timeRemaining = 0;
  private intervalId: NodeJS.Timeout | null = null;
  private onTick?: (timeRemaining: number, sessionType: SessionTypeType) => void;
  private onSessionComplete?: (sessionType: SessionTypeType, nextSession: SessionTypeType) => void;

  private readonly sessionDurationMap: Record<SessionTypeType, keyof PomodoroConfig> = {
    [SessionType.WORK]: 'workDuration',
    [SessionType.SHORT_BREAK]: 'shortBreakDuration',
    [SessionType.LONG_BREAK]: 'longBreakDuration'
  };

  constructor(config: PomodoroConfig) {
    this.config = config;
    this.timeRemaining = config.workDuration * 60;
  }

  public start(): void {
    if (this.state === TimerState.RUNNING) return;
    
    this.state = TimerState.RUNNING;
    this.intervalId = setInterval(() => {
      this.tick();
    }, 1000);
  }

  public pause(): void {
    if (this.state !== TimerState.RUNNING) return;
    
    this.state = TimerState.PAUSED;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  public stop(): void {
    this.state = TimerState.STOPPED;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.reset();
  }

  public reset(): void {
    this.currentSession = SessionType.WORK;
    this.sessionCount = 0;
    this.timeRemaining = this.config.workDuration * 60;
  }

  private tick(): void {
    this.timeRemaining--;
    
    if (this.onTick) {
      this.onTick(this.timeRemaining, this.currentSession);
    }

    if (this.timeRemaining <= 0) {
      this.completeSession();
    }
  }

  private completeSession(): void {
    const currentSession = this.currentSession;
    const nextSession = this.getNextSession();
    
    if (this.onSessionComplete) {
      this.onSessionComplete(currentSession, nextSession);
    }

    this.currentSession = nextSession;
    this.timeRemaining = this.getSessionDuration(nextSession) * 60;
  }

  private getNextSession(): SessionTypeType {
    if (this.currentSession === SessionType.WORK) {
      this.sessionCount++;
      if (this.sessionCount % this.config.sessionsUntilLongBreak === 0) {
        return SessionType.LONG_BREAK;
      }
      return SessionType.SHORT_BREAK;
    }
    return SessionType.WORK;
  }

  private getSessionDuration(sessionType: SessionTypeType): number {
    const configKey = this.sessionDurationMap[sessionType];
    return this.config[configKey] ?? this.config.workDuration;
  }

  public onTickCallback(callback: (timeRemaining: number, sessionType: SessionTypeType) => void): void {
    this.onTick = callback;
  }

  public onSessionCompleteCallback(callback: (sessionType: SessionTypeType, nextSession: SessionTypeType) => void): void {
    this.onSessionComplete = callback;
  }

  public getState(): TimerStateType {
    return this.state;
  }

  public getCurrentSession(): SessionTypeType {
    return this.currentSession;
  }

  public getTimeRemaining(): number {
    return this.timeRemaining;
  }

  public getSessionCount(): number {
    return this.sessionCount;
  }
}