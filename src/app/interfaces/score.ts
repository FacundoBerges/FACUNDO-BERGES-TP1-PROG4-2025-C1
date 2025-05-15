export interface Score {
  id?: string;
  created_at?: Date;
  game_id: string;
  user_id: string;
  remaining_time_milis: number;
  correct: number;
  wrong: number;
  total_score: number;
}

export const SCORE_COLUMNS = [
  {
    header: 'ID',
    field: 'id',
  },
  {
    header: 'Fecha de creación',
    field: 'created_at',
  },
  {
    header: 'ID Juego',
    field: 'game_id',
  },
  {
    header: 'ID Usuario',
    field: 'user_id',
  },
  {
    header: 'Tiempo restante (ms)',
    field: 'remaining_time_milis',
  },
  {
    header: 'Respuestas correctas',
    field: 'correct',
  },
  {
    header: 'Respuestas incorrectas',
    field: 'wrong',
  },
  {
    header: 'Puntuación total',
    field: 'total_score',
  },
];
