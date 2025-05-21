import { Component, Input } from '@angular/core';

import { Tile } from '../../core/interfaces/tile.interface';
import { TileComponent } from '../tile/tile.component';

@Component({
  selector: 'juegos-grid',
  imports: [TileComponent],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.scss',
})
export class GridComponent {
  @Input() tiles: (Tile | null)[] = [];
  @Input() size: number = 4;

  get backgroundCells(): null[] {
    return Array(this.size * this.size).fill(null);
  }

  trackTileById(index: number, tile: Tile | null): string | undefined {
    return tile ? tile.id : undefined;
  }
}
