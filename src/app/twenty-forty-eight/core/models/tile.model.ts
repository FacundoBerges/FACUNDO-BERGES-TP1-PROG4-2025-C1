import { Position } from '../interfaces/position.interface';
import { Tile } from '../interfaces/tile.interface';

// Función simple para generar IDs únicos si unique-id.service no está disponible/portado aún
const generateUniqueId = (): string =>
  Math.random().toString(36).substring(2, 15);

export class TileModel implements Tile {
  id: string;
  x: number;
  y: number;
  value: number;
  originalX?: number;
  originalY?: number;
  merged?: boolean;
  isNew?: boolean;
  previousPosition: Position | null = null; // Propiedad añadida

  constructor(position: Position, value: number, id?: string) {
    // id ahora es opcional
    this.id = id || generateUniqueId(); // Usar id provisto o generar uno nuevo
    this.x = position.x;
    this.y = position.y;
    this.value = value || 2;
    this.merged = false;
    this.isNew = true;
  }

  public get position(): Position {
    return {
      x: this.x,
      y: this.y,
    };
  }

  public savePosition(): void {
    this.originalX = this.x;
    this.originalY = this.y;
    this.previousPosition = { x: this.x, y: this.y }; // Actualizar previousPosition
  }

  public reset(): void {
    this.merged = false;
  }

  public updatePosition(newPosition: Position): void {
    this.x = newPosition.x;
    this.y = newPosition.y;
    this.isNew = false;
  }
}
