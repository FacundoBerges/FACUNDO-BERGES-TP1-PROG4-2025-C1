import { inject, Injectable, signal } from '@angular/core';

import { GridService } from './grid.service';
import { TileModel } from '../models/tile.model';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  public _gridService = inject(GridService);
  public currentScore = signal(0);
  public tiles = signal<(TileModel | null)[]>([]);
  public gameOver = signal(false);
  public won = signal(false);
  public moves = signal(0);

  public readonly size: number;

  private readonly winningValue = 2048;
  private keepPlayingSignal = signal(false);

  constructor() {
    this.size = this._gridService.size;
  }

  public newGame(): void {
    const startingTiles = this._gridService.buildBoardWithStartingPosition();
    this.tiles.set(startingTiles);
    this.currentScore.set(0);
    this.gameOver.set(false);
    this.won.set(false);
    this.keepPlayingSignal.set(false);
  }

  public move(key: string): void {
    this.moves.update((prev) => prev + 1);
    
    if (this.gameOver() || (this.won() && !this.keepPlayingSignal())) {
      return;
    }

    const tilesToProcess = [...this.tiles()];

    this._gridService.prepareTilesState(tilesToProcess);

    const moveResult = this._gridService.traverseTiles(key, tilesToProcess);

    if (moveResult.moved) {
      this.updateScore(moveResult.score);

      const hasWon = tilesToProcess.some(
        (tile) => tile && tile.value === this.winningValue
      );
      if (hasWon && !this.won()) {
        this.won.set(true);
      }

      this._gridService.addRandomTile(tilesToProcess);

      this.tiles.set(tilesToProcess);

      if (!this.movesAvailable(tilesToProcess)) {
        this.gameOver.set(true);
      }
    }
  }

  public movesAvailable(tilesArray: (TileModel | null)[]): boolean {
    return (
      this._gridService.anyCellsAvailable(tilesArray) ||
      this._gridService.tileMatchesAvailable(tilesArray)
    );
  }

  public publicKeepPlaying(): void {
    if (this.won()) {
      this.keepPlayingSignal.set(true);
      this.gameOver.set(false);
    }
  }

  private updateScore(value: number): void {
    const newScore = this.currentScore() + value;

    this.currentScore.set(newScore);
  }
}
