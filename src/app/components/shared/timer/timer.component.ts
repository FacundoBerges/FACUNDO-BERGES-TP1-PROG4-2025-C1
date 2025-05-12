import { Component, effect, EffectRef, input, OnDestroy, output, signal } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'juegos-timer',
  imports: [DatePipe],
  templateUrl: './timer.component.html',
  styleUrl: './timer.component.scss',
})
export class TimerComponent implements OnDestroy {
  private _startTime!: number;
  public static readonly DEFAULT_TIME: number = 60 * 2 * 1000; // 2 minutes by default
  public initialTimeMilis = input<number>(TimerComponent.DEFAULT_TIME);
  public run = input.required<boolean>();
  public runEffect: EffectRef;
  public timerStoppedEmitter = output<number>();
  public timerFinishedEmitter = output<void>();
  public timeLeft = signal<number>(0);
  public timeLeftEffect: EffectRef;
  public interval?: NodeJS.Timeout;

  constructor() {
    this.runEffect = effect(
      () => {
        const shouldRun = this.run();

        shouldRun ? this._startTimer() : this._stopTimer();
      },
      {
        manualCleanup: true,
      }
    );

    this.timeLeftEffect = effect(
      () => {
        this.timeLeft.set(this.initialTimeMilis());
      },
      {
        manualCleanup: true,
      }
    );
  }

  ngOnDestroy(): void {
    this._stopTimer(true);
    this.runEffect.destroy();
    this.timeLeftEffect.destroy();
  }

  private _startTimer(): void {
    if (this.interval) return;

    this._startTime = Date.now();
    this._tick();
  }

  private _stopTimer(isDestroying: boolean = false): void {
    if (!this.interval) return;

    clearTimeout(this.interval);
    this.interval = undefined;

    if (!isDestroying) {
      if (this.timeLeft() <= 0) {
        this.timerFinishedEmitter.emit();
        return;
      }

      this.timerStoppedEmitter.emit(this.timeLeft());
    }
  }

  private _tick(): void {
    const now = Date.now();
    const elapsedTime = now - this._startTime;
    const remainingTime = this.initialTimeMilis() - elapsedTime;

    if (remainingTime <= 0) {
      this.timeLeft.set(0);
      this._stopTimer(false);
      return;
    }

    this.timeLeft.set(remainingTime);

    const nextTickExpectedTime = this._startTime + elapsedTime + 10;
    const delay = nextTickExpectedTime - now;

    this.interval = setTimeout(() => this._tick(), delay > 0 ? delay : 0);
  }
}
