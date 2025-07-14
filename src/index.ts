import { PomodoroTimer } from './PomodoroTimer';
import { TerminalUI } from './TerminalUI';
import type { PomodoroConfig } from './types/PomodoroConfig';

const defaultConfig: PomodoroConfig = {
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  sessionsUntilLongBreak: 4
};

const timer = new PomodoroTimer(defaultConfig);
const ui = new TerminalUI(timer, defaultConfig);

ui.start();