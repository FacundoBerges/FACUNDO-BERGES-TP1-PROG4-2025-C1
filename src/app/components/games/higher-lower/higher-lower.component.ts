import { Component, inject, signal } from '@angular/core';

import { LowerOrHigher } from '../../../interfaces/lower-higher';
import { HigherLowerService } from '../../../services/higher-lower.service';
import { GameButtonComponent } from '../../ui/button/game-button.component';
import { HigherLowerCardComponent } from './higher-lower-card/higher-lower-card.component';
import { TimerComponent } from '../../shared/timer/timer.component';
import { ScoreComponent } from '../../shared/score/score.component';
import { GameDialogComponent } from '../../shared/game-dialog/game-dialog.component';
import { RestartButtonComponent } from '../../ui/restart-button/restart-button.component';

@Component({
  selector: 'juegos-higher-lower',
  imports: [
    HigherLowerCardComponent,
    GameButtonComponent,
    TimerComponent,
    ScoreComponent,
    GameDialogComponent,
    RestartButtonComponent,
  ],
  templateUrl: './higher-lower.component.html',
  styleUrl: './higher-lower.component.scss',
})
export class HigherLowerComponent {
  public readonly CARD_BACK: string = 'grey_back';
  public higherLowerService: HigherLowerService = inject(HigherLowerService);
  public correctGuesses = signal<number>(0);
  public isGameOver = signal<boolean>(false);
  public currentScore = signal<number>(0);
  public endedByTimeout = signal<boolean>(false);
  public showDialog = signal<boolean>(false);

  constructor() {
    this.higherLowerService.newDeck();
  }

  public get gameOverMessage(): string {
    if (this.endedByTimeout()) return 'Fin de la partida! Se acabó el tiempo!';

    return `Fin de la partida! Has acertado ${this.correctGuesses()} cartas! Total de puntos: ${this.currentScore()}`;
  }

  public get deck(): string[] {
    return this.higherLowerService.deck();
  }

  public get lastCard(): string {
    return this.higherLowerService.lastCard();
  }

  public closeDialog(): void {
    this.showDialog.set(false);
  }

  public drawCard(guess: LowerOrHigher): void {
    if (this.isGameOver()) return;

    const lastCard: string = this.higherLowerService.lastCard();
    const currentCard: string = this.higherLowerService.drawCard();

    this._guessCard(guess, lastCard, currentCard);
  }

  private _guessCard(
    guess: LowerOrHigher,
    lastCard: string,
    currentCard: string
  ): void {
    const lastValue: number = this.higherLowerService.getCardValue(lastCard);
    const currentValue: number =
      this.higherLowerService.getCardValue(currentCard);

    this.higherLowerService.lastCard.set(currentCard);

    if (
      (guess === 'higher' && currentValue < lastValue) ||
      (guess === 'lower' && currentValue > lastValue)
    ) {
      this.isGameOver.set(true);
      return;
    }

    this.correctGuesses.update((guess) => ++guess);

    const guessCount: number = this.correctGuesses();
    const currentScore: number =
      this.higherLowerService.calculateCurrentScore(guessCount);

    this.currentScore.set(currentScore);
  }

  public resetGame(): void {
    this.higherLowerService.newDeck();
    this.isGameOver.set(false);
    this.endedByTimeout.set(false);
    this.correctGuesses.set(0);
    this.currentScore.set(0);
  }

  public onTimeout(): void {
    this.endedByTimeout.set(true);
    this.isGameOver.set(true);
    this.showDialog.set(true);
    console.log('Game out of time');
  }

  public setGameOver(remainingTimeMilis: number): void {
    this.isGameOver.set(true);
    console.log('guess:', this.correctGuesses());
    console.log('Remaining time:', remainingTimeMilis);

    const score: number = this.higherLowerService.calculateTotal(
      remainingTimeMilis,
      this.correctGuesses()
    );
    console.log('Score:', score);
    this.currentScore.set(score);

    this.showDialog.set(true);

    this.higherLowerService.saveScore({
      guess: this.correctGuesses(),
      remainingTimeMilis,
    });
  }
}
