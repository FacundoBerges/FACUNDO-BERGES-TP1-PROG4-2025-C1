import { Position } from './position.interface';

export interface Tile extends Position {
  id?: string;
  value: number;
  originalX?: number;
  originalY?: number;
  merged?: boolean;
  isNew?: boolean;
}
