import * as readline from 'readline';
import { SessionType } from './SessionType';
import { SoundNotifier } from './SoundNotifier';
import type { SessionTypeType } from './types/SessionTypeType';
import type { IPomodoroTimer } from './types/IPomodoroTimer';
import type { ITerminalUI } from './types/ITerminalUI';
import type { ISoundNotifier } from './types/ISoundNotifier';
import type { PomodoroConfig } from './types/PomodoroConfig';

export class TerminalUI implements ITerminalUI {
  private timer: IPomodoroTimer;
  private rl: readline.Interface;
  private soundNotifier: ISoundNotifier;
  private config: PomodoroConfig;

  constructor(timer: IPomodoroTimer, config: PomodoroConfig) {
    this.timer = timer;
    this.config = config;
    this.soundNotifier = new SoundNotifier();
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    this.setupTimerCallbacks();
    this.setupInputHandling();
  }

  private setupTimerCallbacks(): void {
    this.timer.onTickCallback((timeRemaining: number, sessionType: SessionTypeType) => {
      this.displayTimer(timeRemaining, sessionType);
    });

    this.timer.onSessionCompleteCallback((currentSession: SessionTypeType, nextSession: SessionTypeType) => {
      this.displaySessionComplete(currentSession, nextSession);
    });
  }

  private setupInputHandling(): void {
    this.rl.on('line', (input: string) => {
      this.handleCommand(input.trim().toLowerCase());
    });

    process.on('SIGINT', () => {
      this.cleanup();
      process.exit(0);
    });
  }

  private handleCommand(command: string): void {
    const commandMap: Record<string, () => void> = {
      's': () => this.timer.start(),
      'start': () => this.timer.start(),
      'p': () => this.timer.pause(),
      'pause': () => this.timer.pause(),
      'stop': () => this.timer.stop(),
      'r': () => this.timer.reset(),
      'reset': () => this.timer.reset(),
      'h': () => this.showHelp(),
      'help': () => this.showHelp(),
      'q': () => this.quit(),
      'quit': () => this.quit()
    };

    const action = commandMap[command];
    if (action) {
      action();
    } else {
      console.log('Unknown command. Type "h" for help.');
    }
    this.showPrompt();
  }

  private displayTimer(timeRemaining: number, sessionType: SessionTypeType): void {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    const sessionName = this.getSessionDisplayName(sessionType);
    const state = this.timer.getState();
    const sessionCount = this.timer.getSessionCount();
    
    process.stdout.write('\x1b[2J\x1b[H');
    console.log('='.repeat(50));
    console.log(`         POMODORO TIMER`);
    console.log('='.repeat(50));
    console.log(`Session: ${sessionName} (#${sessionCount})`);
    console.log(`Time: ${timeString}`);
    console.log(`Status: ${state.toUpperCase()}`);
    console.log('='.repeat(50));
    
    if (timeRemaining > 0) {
      const totalTime = this.getTotalSessionTime(sessionType);
      const progress = ((totalTime - timeRemaining) / totalTime) * 100;
      this.displayProgressBar(progress);
    }
  }

  private displayProgressBar(progress: number): void {
    const barLength = 40;
    const filledLength = Math.floor((progress / 100) * barLength);
    const bar = '█'.repeat(filledLength) + '░'.repeat(barLength - filledLength);
    console.log(`Progress: [${bar}] ${progress.toFixed(1)}%`);
  }

  private displaySessionComplete(currentSession: SessionTypeType, nextSession: SessionTypeType): void {
    const currentName = this.getSessionDisplayName(currentSession);
    const nextName = this.getSessionDisplayName(nextSession);
    
    if (currentSession === SessionType.WORK) {
      this.soundNotifier.playSessionComplete();
    } else {
      this.soundNotifier.playBreakComplete();
    }
    
    console.log('\n🎉 Session Complete!');
    console.log(`Finished: ${currentName}`);
    console.log(`Next: ${nextName}`);
    console.log('Press "s" to start the next session.');
  }

  private getSessionDisplayName(sessionType: SessionTypeType): string {
    const displayMap: Record<SessionTypeType, string> = {
      [SessionType.WORK]: 'Work',
      [SessionType.SHORT_BREAK]: 'Short Break',
      [SessionType.LONG_BREAK]: 'Long Break'
    };
    return displayMap[sessionType] ?? 'Unknown';
  }

  private getTotalSessionTime(sessionType: SessionTypeType): number {
    const durationMap: Record<SessionTypeType, keyof PomodoroConfig> = {
      [SessionType.WORK]: 'workDuration',
      [SessionType.SHORT_BREAK]: 'shortBreakDuration',
      [SessionType.LONG_BREAK]: 'longBreakDuration'
    };
    const configKey = durationMap[sessionType];
    return (this.config[configKey] ?? this.config.workDuration) * 60;
  }

  private showHelp(): void {
    console.log('\nCommands:');
    console.log('  s, start  - Start the timer');
    console.log('  p, pause  - Pause the timer');
    console.log('  stop      - Stop and reset the timer');
    console.log('  r, reset  - Reset the timer');
    console.log('  h, help   - Show this help');
    console.log('  q, quit   - Quit the application');
  }

  private showPrompt(): void {
    this.rl.prompt();
  }

  private quit(): void {
    console.log('Goodbye!');
    this.cleanup();
    process.exit(0);
  }

  private cleanup(): void {
    this.rl.close();
  }

  public start(): void {
    console.log('Welcome to Pomodoro Timer!');
    console.log('Type "h" for help or "s" to start.');
    this.displayTimer(this.timer.getTimeRemaining(), this.timer.getCurrentSession());
    this.showPrompt();
  }
}