import { inject, Injectable, signal } from '@angular/core';

import { shuffle } from 'underscore';

import { environment } from '../../environments/environment';
import { ranks, suits } from '../helpers/deck';
import { AuthService } from './auth.service';
import { ScoreService } from './score.service';
import { HigherLowerScore } from '../interfaces/higher-lower-score';
import { Score } from '../interfaces/score';

@Injectable({
  providedIn: 'root',
})
export class HigherLowerService {
  private readonly GAME_ID: string = environment.higherLowerId;
  private readonly GUESS_MULTIPLIER: number = 5;
  private _authService: AuthService = inject(AuthService);
  private _scoreService: ScoreService = inject(ScoreService);
  public scores = signal<Score[]>([]);
  public deck = signal<string[]>([]);
  public lastCard = signal<string>('');

  private _initializeDeck(): void {
    let deck: string[] = [];

    for (const suit of suits) {
      for (const rank of ranks) {
        deck.push(`${rank}${suit}`);
      }
    }

    const shuffledDeck = shuffle<string[]>(deck);

    this.deck.set(shuffledDeck);

    const firstCard: string = this.drawCard();

    this.lastCard.set(firstCard);
  }

  public newDeck(): void {
    this._initializeDeck();
  }

  public drawCard(): string {
    if (this.deck().length === 0) throw new Error('No more cards in the deck');

    console.log('Deck length:', this.deck().length);

    return this.deck().pop()!;
  }

  public getCardValue(card: string): number {
    const rank: string = card.slice(0, -1);

    if (rank === 'A') return 1;
    if (rank === 'J') return 11;
    if (rank === 'Q') return 12;
    if (rank === 'K') return 13;
    return parseInt(rank);
  }

  public calculateCurrentScore(guess: number): number {
    return guess * this.GUESS_MULTIPLIER;
  }

  public calculateTotal(remainingTimeMilis: number, guess: number): number {
    if (guess <= 0) return 0;

    const correctScore: number = this.calculateCurrentScore(guess);
    const totalScore: number = (correctScore * remainingTimeMilis) / 1000;

    return Math.floor(totalScore);
  }

  public async saveScore(higherLowerScore: HigherLowerScore): Promise<void> {
    const { remainingTimeMilis, guess } = higherLowerScore;
    const total = this.calculateTotal(remainingTimeMilis, guess);
    const userId = this._authService.user()?.id;

    if (total <= 0) {
      console.log('Score is zero or negative, not saving.');
      return;
    }

    if (!userId) {
      console.error('User ID is not available, cannot save score.');
      return;
    }

    const score: Score = {
      user_id: userId,
      game_id: this.GAME_ID,
      remaining_time_milis: remainingTimeMilis,
      correct: guess,
      wrong: 1,
      total_score: total,
    };

    await this._scoreService.saveScore(score);
    console.log('Score saved successfully:', score);
  }

  public async getScores(): Promise<void> {
    this._scoreService.getScores(this.GAME_ID).then((scores) => {
      this.scores.set(scores);
    });
  }
}
