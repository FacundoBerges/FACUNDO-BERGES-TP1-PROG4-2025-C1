import { inject, Injectable, signal } from '@angular/core';

import { environment } from '../../../../environments/environment';

import { AuthService } from '../../../services/auth.service';
import { ScoreService } from '../../../services/score.service';

import { Score } from '../../../interfaces/score';
import { TwentyFortyEightScore } from '../interfaces/twenty-forty-eight-score';

@Injectable({
  providedIn: 'root',
})
export class TwentyFortyEightService {
  private readonly GAME_ID = environment.twentyFortyEightId;
  private _authService: AuthService = inject(AuthService);
  private _scoreService: ScoreService = inject(ScoreService);
  public isLoading = signal(false);
  public scores = signal<Score[]>([]);

  public async saveScore(twentyFortyEightScore: TwentyFortyEightScore) {
    const { score, moves, remainingTime } = twentyFortyEightScore;
    const userId = this._authService.user()?.id;

    if (!userId) {
      console.error('User ID is not available. Cannot save score.');
      return;
    }

    const scoreDB: Score = {
      game_id: this.GAME_ID,
      user_id: userId,
      wrong: 1,
      correct: moves,
      total_score: score * remainingTime,
      remaining_time_milis: 0,
    };

    await this._scoreService.saveScore(scoreDB);
    console.log('Score saved successfully:', score);
  }

  public async getScores(): Promise<void> {
    this.isLoading.set(true);

    this._scoreService.getScores(this.GAME_ID).then((scores) => {
      this.scores.set(scores);
      this.isLoading.set(false);
    });
  }
}
