import { inject, Injectable, signal } from '@angular/core';

import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { ScoreService } from './score.service';
import { HangmanScore } from '../interfaces/hangman-score';
import { Score } from '../interfaces/score';

@Injectable({
  providedIn: 'root',
})
export class HangmanService {
  private readonly GAME_ID: string = environment.hangmanId;
  private _authService: AuthService = inject(AuthService);
  private _scoreService: ScoreService = inject(ScoreService);
  private _words: string[] = [
    'HANGMAN',
    'ANGULAR',
    'TYPESCRIPT',
    'JAVASCRIPT',
    'PROGRAMMING',
    'DEVELOPER',
    'COMPUTER',
    'SOFTWARE',
    'APPLICATION',
    'GAMES',
    'FRONTEND',
    'BACKEND',
    'FULLSTACK',
    'PERFORMANCE',
    'RESPONSIVE',
    'ACCESSIBILITY',
    'USABILITY',
    'ARCHITECTURE',
    'DATABASE',
    'SERVER',
    'NETWORK',
    'SECURITY',
    'PROTOCOL',
    'ALGORITHM',
    'DATA',
    'STRUCTURE',
    'ANALYSIS',
    'TESTING',
    'DEBUGGING',
    'DEPLOYMENT',
    'GITHUB',
    'AGILE',
    'SCRUM',
    'DEVOPS',
    'VIRTUALIZATION',
    'CONTAINERIZATION',
    'MICROSERVICES',
    'API REST',
  ];
  public scores = signal<Score[]>([]);

  public get randomWord(): string {
    const randomIndex = Math.floor(Math.random() * this._words.length);

    return this._words[randomIndex];
  }

  public calculateTotal(
    remainingTimeMilis: number,
    correctAnswers: number,
    wrongAnswers: number
  ): number {
    if (correctAnswers < wrongAnswers) return 0;

    const correctScore: number = correctAnswers * 25;
    const wrongScore: number = wrongAnswers * 10;
    const totalScore: number =
      ((correctScore - wrongScore) * remainingTimeMilis) / 1000;

    return Math.floor(totalScore);
  }

  public async saveScore(hangmanScore: HangmanScore): Promise<void> {
    const { remainingTimeMilis, correctAnswers, wrongAnswers } = hangmanScore;
    const total: number = this.calculateTotal(
      remainingTimeMilis,
      correctAnswers,
      wrongAnswers
    );
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
      correct: correctAnswers,
      wrong: wrongAnswers,
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
