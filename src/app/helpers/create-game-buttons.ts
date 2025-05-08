import { GameButton } from '../interfaces/game-button';

export const createGameButtons = (labels: string[]): GameButton[] => {
  return labels.map((label) => ({
    label: label.toUpperCase(),
    isDisabled: false,
  }));
};
