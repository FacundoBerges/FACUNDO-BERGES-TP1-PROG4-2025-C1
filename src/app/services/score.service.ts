import { inject, Injectable } from '@angular/core';

import { SupabaseService } from './supabase.service';
import { Score } from '../interfaces/score';

@Injectable({
  providedIn: 'root',
})
export class ScoreService {
  private _supabaseService: SupabaseService = inject(SupabaseService);

  public async saveScore(score: Score): Promise<void> {
    const { data, error } = await this._supabaseService.supabaseClient
      .from('scores')
      .insert({
        game_id: score.game_id,
        user_id: score.user_id,
        remaining_time_milis: score.remaining_time_milis,
        correct: score.correct,
        wrong: score.wrong,
        total_score: score.total_score,
      });

    if (error) {
      console.error('Error saving score:', error);
      return;
    }
  }

  public async getScores(gameId: string): Promise<Score[]> {
    const { data, error } = await this._supabaseService.supabaseClient
      .from('scores')
      .select('*')
      .eq('game_id', gameId)
      .order('score', { ascending: false })
      .limit(100);

    if (error) {
      console.error('Error fetching scores:', error);
      return [];
    }

    return data;
  }
}
