import { Injectable } from '@angular/core';

import { Position } from '../interfaces/position.interface';
import { GridPositions } from '../interfaces/grid-positions.interface';
import { TileModel } from '../models/tile.model';
import { VECTORS } from '../enums/vectors.enum';

@Injectable({
  providedIn: 'root',
})
export class GridService {
  private STARTING_TILE_NUM = 2;
  public size: number = 4;

  public buildEmptyBoard(): (TileModel | null)[] {
    return Array(this.size * this.size).fill(null);
  }

  public prepareTilesState(currentTiles: (TileModel | null)[]): void {
    currentTiles.forEach((tile) => {
      if (tile) {
        tile.savePosition();
        tile.reset();
        tile.isNew = false;
      }
    });
  }

  public traversalDirections(key: string): GridPositions {
    const vector: Position = VECTORS[key];
    const positions: GridPositions = { x: [], y: [] };

    for (let i = 0; i < this.size; i++) {
      positions.x.push(i);
      positions.y.push(i);
    }

    if (vector.x > 0) {
      positions.x = positions.x.reverse();
    }
    if (vector.y > 0) {
      positions.y = positions.y.reverse();
    }
    return positions;
  }

  public withinGrid(cell: Position): boolean {
    return (
      cell.x >= 0 && cell.x < this.size && cell.y >= 0 && cell.y < this.size
    );
  }

  public cellAvailable(
    cell: Position,
    tilesArray: (TileModel | null)[]
  ): boolean {
    if (this.withinGrid(cell)) {
      return !this.getCellFromArray(cell, tilesArray);
    }
    return false;
  }

  public buildBoardWithStartingPosition(): (TileModel | null)[] {
    const board = this.buildEmptyBoard();
    for (let i = 0; i < this.STARTING_TILE_NUM; i++) {
      this.addRandomTile(board);
    }
    return board;
  }

  public tileMatchesAvailable(tilesArray: (TileModel | null)[]): boolean {
    for (let i = 0; i < tilesArray.length; i++) {
      const tile = tilesArray[i];
      if (tile) {
        const pos = this._positionToCoordinates(i);
        for (const directionKey in VECTORS) {
          const vector = VECTORS[directionKey];
          const cell: Position = { x: pos.x + vector.x, y: pos.y + vector.y };
          const other = this.getCellFromArray(cell, tilesArray);
          if (other && other.value === tile.value) {
            return true;
          }
        }
      }
    }
    return false;
  }

  private getCellFromArray(
    pos: Position,
    tilesArray: (TileModel | null)[]
  ): TileModel | null {
    if (this.withinGrid(pos)) {
      const index = this._coordinatesToPosition(pos);
      if (index >= 0 && index < tilesArray.length) {
        return tilesArray[index];
      }
    }
    return null;
  }

  public getAvailableCells(tilesArray: (TileModel | null)[]): Position[] {
    const cells: Position[] = [];
    for (let i = 0; i < tilesArray.length; i++) {
      if (!tilesArray[i]) {
        const pos = this._positionToCoordinates(i);
        cells.push(pos);
      }
    }
    return cells;
  }

  public anyCellsAvailable(tilesArray: (TileModel | null)[]): boolean {
    return this.getAvailableCells(tilesArray).length > 0;
  }

  public traverseTiles(
    directionKey: string,
    tilesToMutate: (TileModel | null)[]
  ): { moved: boolean; score: number } {
    const vector: Position = VECTORS[directionKey];
    const size = this.size;

    let cellOrder: Position[] = [];
    if (vector.x === 1) {
      for (let y = 0; y < size; y++)
        for (let x = size - 1; x >= 0; x--) cellOrder.push({ x, y });
    } else if (vector.x === -1) {
      for (let y = 0; y < size; y++)
        for (let x = 0; x < size; x++) cellOrder.push({ x, y });
    } else if (vector.y === 1) {
      for (let x = 0; x < size; x++)
        for (let y = size - 1; y >= 0; y--) cellOrder.push({ x, y });
    } else {
      for (let x = 0; x < size; x++)
        for (let y = 0; y < size; y++) cellOrder.push({ x, y });
    }

    let moved = false;
    let iterationScore = 0;

    tilesToMutate.forEach((tile) => {
      if (tile) tile.merged = false;
    });

    cellOrder.forEach((cell) => {
      const currentTileFlatIndex = this._coordinatesToPosition(cell);
      const currentTile = tilesToMutate[currentTileFlatIndex];

      if (currentTile) {
        const originalTilePosition = { x: currentTile.x, y: currentTile.y };

        const { farthest, nextTile } = this.findFarthestPosition(
          originalTilePosition,
          vector,
          tilesToMutate
        );

        if (
          nextTile &&
          nextTile.value === currentTile.value &&
          !nextTile.merged &&
          !currentTile.merged
        ) {
          const mergedValue = currentTile.value * 2;
          iterationScore += mergedValue;

          const nextTileOriginalPosition = { x: nextTile.x, y: nextTile.y };
          const nextTileFlatIndex = this._coordinatesToPosition(
            nextTileOriginalPosition
          );

          const newMergedTile = new TileModel(
            nextTileOriginalPosition,
            mergedValue
          );
          newMergedTile.merged = true;
          newMergedTile.previousPosition = {
            x: originalTilePosition.x,
            y: originalTilePosition.y,
          };
          newMergedTile.isNew = false;

          tilesToMutate[nextTileFlatIndex] = newMergedTile;
          tilesToMutate[currentTileFlatIndex] = null;

          moved = true;
        } else {
          const farthestFlatIndex = this._coordinatesToPosition(farthest);
          if (currentTileFlatIndex !== farthestFlatIndex) {
            currentTile.previousPosition = {
              x: originalTilePosition.x,
              y: originalTilePosition.y,
            };
            currentTile.updatePosition(farthest);

            tilesToMutate[farthestFlatIndex] = currentTile;
            tilesToMutate[currentTileFlatIndex] = null;
            moved = true;
          }
        }
      }
    });

    return { moved, score: iterationScore };
  }

  public addRandomTile(tilesArray: (TileModel | null)[]): void {
    const emptyCells = this.getAvailableCells(tilesArray);
    if (emptyCells.length > 0) {
      const position =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];
      const value = Math.random() < 0.9 ? 2 : 4;
      const newRandomTile = new TileModel(position, value);
      newRandomTile.isNew = true;

      const flatIndex = this._coordinatesToPosition(position);
      if (flatIndex >= 0 && flatIndex < tilesArray.length) {
        tilesArray[flatIndex] = newRandomTile;
      } else {
        const nullSpotIndex = tilesArray.findIndex((t) => t === null);
        if (nullSpotIndex !== -1) tilesArray[nullSpotIndex] = newRandomTile;
      }
    }
  }

  private findFarthestPosition(
    cell: Position,
    vector: Position,
    tilesArray: (TileModel | null)[]
  ): { farthest: Position; nextTile: TileModel | null } {
    let currentSearchPos = { ...cell };
    let nextPotentialPos;

    do {
      nextPotentialPos = {
        x: currentSearchPos.x + vector.x,
        y: currentSearchPos.y + vector.y,
      };

      if (!this.withinGrid(nextPotentialPos)) {
        break;
      }

      if (this.getCellFromArray(nextPotentialPos, tilesArray)) {
        break;
      }

      currentSearchPos = nextPotentialPos;
    } while (true);

    const tileAtStoppingPoint = this.getCellFromArray(
      nextPotentialPos,
      tilesArray
    );

    return {
      farthest: currentSearchPos,
      nextTile: tileAtStoppingPoint,
    };
  }

  public forEach(
    callback: (x: number, y: number, tile: TileModel | null) => void,
    tilesArray: (TileModel | null)[]
  ): void {
    for (let i = 0; i < tilesArray.length; i++) {
      const pos = this._positionToCoordinates(i);
      callback(pos.x, pos.y, tilesArray[i]);
    }
  }

  private _positionToCoordinates(index: number): Position {
    const x = index % this.size;
    const y = Math.floor(index / this.size);
    return { x, y };
  }

  private _coordinatesToPosition(pos: Position): number {
    return pos.y * this.size + pos.x;
  }

  public samePositions(a: Position, b: Position): boolean {
    return a.x === b.x && a.y === b.y;
  }
}
