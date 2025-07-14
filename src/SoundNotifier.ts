import player from 'play-sound';
import * as path from 'path';
import type { ISoundNotifier } from './types/ISoundNotifier';

export class SoundNotifier implements ISoundNotifier {
  private audioPlayer = player();
  private assetsPath: string;

  constructor() {
    this.assetsPath = path.join(__dirname, 'assets');
  }

  public playSessionComplete(): void {
    const soundPath = path.join(this.assetsPath, 'session-complete.mp3');
    this.playSound(soundPath);
  }

  public playBreakComplete(): void {
    const soundPath = path.join(this.assetsPath, 'break-complete.mp3');
    this.playSound(soundPath);
  }

  public playCustomSound(filePath: string): void {
    this.playSound(filePath);
  }

  private playSound(filePath: string): void {
    this.audioPlayer.play(filePath, (err: Error | null) => {
      if (err) {
        console.error(`Could not play sound: ${err.message}`);
        this.fallbackBeep();
      }
    });
  }

  private fallbackBeep(): void {
    process.stdout.write('\x07');
  }
}