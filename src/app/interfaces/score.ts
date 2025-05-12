export interface Score {
  id?: number;
  created_at?: Date;
  game_id: string;
  user_id: string;
  remaining_time_milis: number;
  correct: number;
  wrong: number;
  total_score: number;
}
