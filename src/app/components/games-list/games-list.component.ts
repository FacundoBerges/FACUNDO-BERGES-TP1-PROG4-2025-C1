import { Component, input, InputSignal } from '@angular/core';

import { GameCardComponent } from '../game-card/game-card.component';
import { Game } from '../../interfaces/game';

@Component({
  selector: 'juegos-games-list',
  imports: [GameCardComponent],
  templateUrl: './games-list.component.html',
  styleUrl: './games-list.component.scss',
})
export class GamesListComponent {
  public games: InputSignal<Game[]> = input.required<Game[]>();
}
