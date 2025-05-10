import { Component, signal, WritableSignal } from '@angular/core';

import { GamesListComponent } from '../../components/games-list/games-list.component';
import { Game } from '../../interfaces/game';

const games: Game[] = [
  {
    name: 'Ahorcado',
    description: 'Adivina la palabra oculta!',
    image: '/assets/img/hangman.png',
    path: '/games/hangman',
  },
  {
    name: 'Mayor o menor',
    description: 'Adivina si el número es mayor o menor!',
    image: '/assets/img/higher-lower.png',
    path: '/games/higher-lower',
  },
  {
    name: 'Preguntados',
    description: 'Responde las preguntas de trivia!',
    image: 'https://placehold.co/150x150',
    path: '/games/trivia',
  },
  {
    name: '2048',
    description: 'Suma los números iguales para llegar a 2048!',
    image: 'https://placehold.co/150x150',
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
