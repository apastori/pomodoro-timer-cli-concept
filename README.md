# Pomodoro Timer

A terminal-based Pomodoro timer application written in TypeScript that helps you manage your work sessions and breaks using the Pomodoro Technique.

## Features

- **Configurable Timer Sessions**: Work sessions, short breaks, and long breaks
- **Interactive Terminal Interface**: Clean, responsive terminal UI with progress bars
- **Sound Notifications**: Audio alerts when sessions complete
- **Session Tracking**: Automatic progression through work and break cycles
- **Real-time Display**: Live countdown timer with session information
- **Multiple Control Options**: Start, pause, stop, reset functionality

## Default Configuration

- **Work Session**: 25 minutes
- **Short Break**: 5 minutes
- **Long Break**: 15 minutes
- **Sessions Until Long Break**: 4 work sessions

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd pomodoro-timer
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

## Usage

### Running the Application

You can run the application in two ways:

**Development mode** (with hot reload):
```bash
npm run dev
```

**Production mode** (compiled):
```bash
npm start
```

### Available Commands

Once the timer is running, you can use these commands:

| Command | Shortcut | Description |
|---------|----------|-------------|
| `start` | `s` | Start the current timer session |
| `pause` | `p` | Pause the running timer |
| `stop` | - | Stop the timer and reset to beginning |
| `reset` | `r` | Reset the timer to the start of current session |
| `help` | `h` | Show list of available commands |
| `quit` | `q` | Exit the application |

### Timer Flow

1. **Work Session**: 25-minute focused work period
2. **Short Break**: 5-minute break after each work session
3. **Long Break**: 15-minute break after every 4 work sessions
4. **Cycle Repeats**: Continues indefinitely until stopped

### Display Information

The terminal interface shows:
- Current session type (Work/Short Break/Long Break)
- Session number
- Time remaining (MM:SS format)
- Timer status (RUNNING/PAUSED/STOPPED)
- Progress bar showing session completion percentage

## Project Structure

```
pomodoro-timer/
├── src/
│   ├── index.ts              # Main entry point
│   ├── PomodoroTimer.ts      # Core timer logic
│   ├── TerminalUI.ts         # Terminal interface and display
│   ├── SoundNotifier.ts      # Audio notification handling
│   ├── SessionType.ts        # Session type enumeration
│   ├── TimerState.ts         # Timer state enumeration
│   ├── assets/               # Audio files for notifications
│   └── types/                # TypeScript type definitions
│       ├── IPomodoroTimer.ts
│       ├── ISoundNotifier.ts
│       ├── ITerminalUI.ts
│       ├── PomodoroConfig.ts
│       ├── SessionTypeType.ts
│       ├── TimerCallbacks.ts
│       ├── TimerState.ts
│       └── TimerStateType.ts
├── dist/                     # Compiled JavaScript output
├── package.json              # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
└── README.md                # This file
```

## Dependencies

### Runtime Dependencies
- **chalk**: Terminal string styling and colors
- **readline**: Built-in Node.js module for terminal input
- **play-sound**: Audio playback for session notifications

### Development Dependencies
- **TypeScript**: Language and compiler
- **ts-node**: TypeScript execution for development
- **@types/node**: Node.js type definitions
- **@types/play-sound**: Type definitions for play-sound
- **cpy-cli**: File copying utility for build process

## Scripts

- `npm run build` - Compile TypeScript to JavaScript and copy assets
- `npm start` - Run the compiled application
- `npm run dev` - Run in development mode with ts-node

## License

MIT License