import { Component, Input } from '@angular/core';

import { Tile } from '../../core/interfaces/tile.interface';

@Component({
  selector: 'juegos-tile',
  imports: [],
  templateUrl: './tile.component.html',
  styleUrl: './tile.component.scss',
})
export class TileComponent {
  @Input() tile: Tile | null = null;

  // @HostBinding('class')
  public get classes(): string {
    if (!this.tile) return '';

    let classNames = `tile tile-${this.tile.value} tile-position-${this.tile.x}-${this.tile.y}`;

    if (this.tile.isNew) classNames += ' tile-new';

    if (this.tile.merged) classNames += ' tile-merged';

    return classNames;
  }
}
