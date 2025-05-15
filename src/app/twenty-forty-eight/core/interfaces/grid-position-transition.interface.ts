import { Position } from './position.interface';
import { Tile } from './tile.interface';

export interface GridPositionTransition {
  newPosition: Position;
  next: Tile | null;
}
