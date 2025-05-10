import { DatePipe } from '@angular/common';
import { Component, input, InputSignal, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';

@Component({
  selector: 'juegos-timer',
  imports: [DatePipe],
  templateUrl: './timer.component.html',
  styleUrl: './timer.component.scss',
})
export class TimerComponent implements OnInit, OnDestroy {
  public initialTimeMilis: InputSignal<number> = input<number>(60 * 2 * 1000); // 2 minutes by default
  public timeLeft: WritableSignal<number> = signal<number>(0);
  public interval?: NodeJS.Timeout;
  private startTime!: number;
  private elapsedPausedTime: number = 0; // To store time elapsed when paused

  ngOnInit(): void {
    this.timeLeft.set(this.initialTimeMilis());
    // We don't start immediately on init, the user or parent component should call startTimer
    this.startTimer();
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }

  public startTimer(): void {
    if (this.interval) return;

    this.startTime = Date.now() - this.elapsedPausedTime; // Adjust start time if resuming
    this._tick(); // Start the recursive timeout
  }

  public stopTimer(): void {
    if (this.interval) {
      clearTimeout(this.interval);
      this.interval = undefined;
      this.elapsedPausedTime = Date.now() - this.startTime;
    }
  }

  public resetTimer(): void {
    this.stopTimer();
    this.timeLeft.set(this.initialTimeMilis());
    this.elapsedPausedTime = 0;
  }

  private _tick(): void {
    const now = Date.now();
    const elapsedTime = now - this.startTime;
    const remainingTime = this.initialTimeMilis() - elapsedTime;

    if (remainingTime <= 0) {
      this.timeLeft.set(0);
      this.stopTimer();
      // Optionally emit an event here to signal the timer has finished
      return;
    }

    this.timeLeft.set(remainingTime);

    const nextTickTime = this.startTime + elapsedTime + 1;
    const delay = nextTickTime - now;

    this.interval = setTimeout(() => this._tick(), delay > 0 ? delay : 0);
  }
}
