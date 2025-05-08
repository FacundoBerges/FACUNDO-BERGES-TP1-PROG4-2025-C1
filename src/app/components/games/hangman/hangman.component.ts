import { Component, computed, inject, Signal, signal, WritableSignal } from '@angular/core';

import { letters } from '../../../helpers/letters';
import { createGameButtons } from '../../../helpers/create-game-buttons';
import { ButtonComponent } from '../../ui/button/button.component';
import { GameButton } from '../../../interfaces/game-button';
import { HangmanService } from '../../../services/hangman.service';
import { HangmanImageComponent } from './hangman-image/hangman-image.component';
import { HangmanWordComponent } from './hangman-word/hangman-word.component';

const letterButtons: GameButton[] = createGameButtons(letters);

@Component({
  selector: 'juegos-hangman',
  imports: [ButtonComponent, HangmanImageComponent, HangmanWordComponent],
  templateUrl: './hangman.component.html',
  styleUrl: './hangman.component.scss',
})
export class HangmanComponent {
  private _hangmanService: HangmanService = inject(HangmanService);
  public MAX_ATTEMPTS: number = 9;
  public hiddenWord: WritableSignal<string> = signal<string>('');
  public word: WritableSignal<string> = signal<string>('HANGMAN');
  public attempts: WritableSignal<number> = signal<number>(0);
  public hasLost: WritableSignal<boolean> = signal<boolean>(false);
  public hasWon: WritableSignal<boolean> = signal<boolean>(false);
  public isGameOver: Signal<boolean> = computed<boolean>( () =>
    this.attempts() >= this.MAX_ATTEMPTS ||
    this.hiddenWord().split(' ').join('').toLocaleUpperCase() === this.word().toLocaleUpperCase()
  );
  public letterButtons: WritableSignal<GameButton[]> = signal<GameButton[]>(letterButtons);

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

  public checkLetter(letter: string): void {
    if (this.isGameOver()) return;

    this.letterButtons.update((buttons) =>
      buttons.map((button) => button.label === letter ? { ...button, isDisabled: true } : button)
    );

    if (!this.word().includes(letter)) {
      this.attempts.update((attempts) => Math.min(++attempts, this.MAX_ATTEMPTS));
      return;
    }

    const newHiddenWord = this._updateHiddenWord(letter);
    this.hiddenWord.set(newHiddenWord);
  }

  public newGame(): void {
    this.word.set(this._hangmanService.randomWord);
    this._setHiddenWord();
    this.attempts.set(0);
    this.hasLost.set(false);
    this.hasWon.set(false);
    this.letterButtons.update((buttons) => buttons.map((button) => ({ ...button, isDisabled: false })));
  }
}
