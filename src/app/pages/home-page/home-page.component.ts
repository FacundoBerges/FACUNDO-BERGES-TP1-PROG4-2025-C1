import { Component, signal, WritableSignal } from '@angular/core';

import { Game } from '../../interfaces/game';
import { GamesListComponent } from '../../components/games-list/games-list.component';

const games: Game[] = [
  {
    name: 'Ahorcado',
    description: 'Adivina la palabra oculta!',
    image: '/assets/img/hangman.jpg',
    path: '/games/hangman',
  },
  {
    name: 'Mayor o menor',
    description: 'Adivina si el número es mayor o menor!',
    image: '/assets/img/higher-lower.jpg',
    path: '/games/higher-lower',
  },
  {
    name: 'Preguntados',
    description: 'Responde las preguntas de trivia!',
    image: '/assets/img/trivia.jpg',
    path: '/games/trivia',
  },
  {
    name: '2048',
    description: 'Suma los números iguales para llegar a 2048!',
    image: '/assets/img/2048.jpg',
    path: '/games/2048',
  },
];

@Component({
  selector: 'juegos-home-page',
  imports: [GamesListComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent {
  public games: WritableSignal<Game[]> = signal([...games]);
}
