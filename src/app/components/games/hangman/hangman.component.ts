import { Component, computed, inject, signal } from '@angular/core';

import { createGameButtons } from '../../../helpers/create-game-buttons';
import { GameButton } from '../../../interfaces/game-button';
import { HangmanService } from '../../../services/hangman.service';
import { letters } from '../../../helpers/letters';
import { ButtonComponent } from '../../ui/button/button.component';
import { HangmanImageComponent } from './hangman-image/hangman-image.component';
import { HangmanWordComponent } from './hangman-word/hangman-word.component';
import { TimerComponent } from '../../shared/timer/timer.component';

const letterButtons: GameButton[] = createGameButtons(letters);

@Component({
  selector: 'juegos-hangman',
  imports: [
    ButtonComponent,
    HangmanImageComponent,
    HangmanWordComponent,
    TimerComponent,
  ],
  templateUrl: './hangman.component.html',
  styleUrl: './hangman.component.scss',
})
export class HangmanComponent {
  private _hangmanService: HangmanService = inject(HangmanService);
  public MAX_ATTEMPTS: number = 9;
  public hiddenWord = signal<string>('');
  public word = signal<string>('HANGMAN');
  public attempts = signal<number>(0);
  public hasLost = signal<boolean>(false);
  public hasWon = signal<boolean>(false);
  public isTimerActive = signal<boolean>(true);
  public isGameOver = computed<boolean>(() => this.hasLost() || this.hasWon());
  public letterButtons = signal<GameButton[]>(letterButtons);

  constructor() {
    this.word.set(this._hangmanService.randomWord);
    this._setHiddenWord();
  }

  private _setHiddenWord(): void {
    const hiddenWord = this.word()
      .split('')
      .map((hiddenLetter) => (hiddenLetter === ' ' ? ' ' : '_'))
      .join(' ');

    this.hiddenWord.set(hiddenWord);
  }

  private _updateHiddenWord(letter: string): string {
    return this.hiddenWord()
      .split(' ')
      .map((hiddenLetter, index) =>
        this.word()[index] === letter ? letter : hiddenLetter
      )
      .join(' ');
  }

  private _updateAttempts(): void {
    this.attempts.update((attempts) => Math.min(++attempts, this.MAX_ATTEMPTS));
  }

  private _updateGameState(): void {
    if (this.attempts() === this.MAX_ATTEMPTS) {
      this.setGameOver();
      return;
    }

    const wordUppercase = this.word().toLocaleUpperCase();
    const hiddenWordUppercase = this.hiddenWord()
      .split(' ')
      .join('')
      .toLocaleUpperCase();

    if (wordUppercase === hiddenWordUppercase) {
      this.isTimerActive.set(false);
    }
  }

  public checkLetter(letter: string): void {
    if (this.isGameOver()) return;

    this.letterButtons.update((buttons) =>
      buttons.map((button) =>
        button.label === letter ? { ...button, isDisabled: true } : button
      )
    );

    if (!this.word().includes(letter)) {
      this._updateAttempts();
      this._updateGameState();
      return;
    }

    const newHiddenWord = this._updateHiddenWord(letter);

    this.hiddenWord.set(newHiddenWord);
    this._updateGameState();
  }

  public newGame(): void {
    this.isTimerActive.set(true);
    this.word.set(this._hangmanService.randomWord);
    this._setHiddenWord();
    this.attempts.set(0);
    this.hasLost.set(false);
    this.hasWon.set(false);
    this.letterButtons.update((buttons) =>
      buttons.map((button) => ({ ...button, isDisabled: false }))
    );
  }

  public setGameOver(): void {
    this.isTimerActive.set(false);
    this.hasLost.set(true);
    console.log('You lost!');
  }

  public setGameWon(remainingTime: number): void {
    if (this.isGameOver()) return;

    this.hasWon.set(true);

    const score: number = this._hangmanService.calculateTotal(
      remainingTime,
      this.word().length,
      this.attempts()
    );

    console.log('You won!');
    console.log('Remaining time:', remainingTime);
    console.log('Score:', score);

    this._hangmanService.saveScore({
      remainingTimeMilis: remainingTime,
      correctAnswers: this.word().length,
      wrongAnswers: this.attempts(),
    });
  }
}
