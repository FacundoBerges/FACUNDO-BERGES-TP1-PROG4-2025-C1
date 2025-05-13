import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

import { AuthService } from './auth.service';
import { ScoreService } from './score.service';

import { TriviaResponse } from '../interfaces/trivia';
import { TriviaScore } from '../interfaces/trivia-score';
import { Score } from '../interfaces/score';

@Injectable({
  providedIn: 'root',
})
export class TriviaService {
  private _httpClient: HttpClient = inject(HttpClient);
  private _authService: AuthService = inject(AuthService);
  private _scoreService: ScoreService = inject(ScoreService);
  private _apiUrl: string = environment.triviaBaseUrl;
  private readonly GAME_ID: string = environment.triviaId;
  private readonly CORRECT_MULTIPLIER: number = 50;
  private readonly WRONG_MULTIPLIER: number = 20;

  public getQuestions(amount: number = 10): Observable<TriviaResponse> {
    return this._httpClient.get<TriviaResponse>(
      `${this._apiUrl}?amount=${amount}`
    );
  }

  public calculateScore(
    questionsQuantity: number,
    correctAnswers: number = 0
  ): number {
    const wrongAnswers = questionsQuantity - correctAnswers;

    const correctScore = correctAnswers * this.CORRECT_MULTIPLIER;
    const wrongScore = wrongAnswers * this.WRONG_MULTIPLIER;

    return (correctScore - wrongScore > 0) ? (correctScore - wrongScore) : 0;
  }

  public async saveScore(triviaScore: TriviaScore) {
    const { questionsQuantity, correctAnswers } = triviaScore;
    const scoreValue = this.calculateScore(questionsQuantity, correctAnswers);
    const userId = this._authService.user()?.id;

    if (!userId) {
      console.error('User ID is not available. Cannot save score.');
      return;
    }

    const score: Score = {
      game_id: this.GAME_ID,
      user_id: userId,
      wrong: questionsQuantity - correctAnswers,
      correct: correctAnswers,
      total_score: scoreValue,
      remaining_time_milis: 0,
    };

    await this._scoreService.saveScore(score);
    console.log('Score saved successfully:', score);
  }
}
