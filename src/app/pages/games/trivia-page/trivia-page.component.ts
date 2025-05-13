import { Component } from '@angular/core';

import { TriviaComponent } from '../../../components/games/trivia/trivia.component';

@Component({
  selector: 'juegos-trivia-page',
  imports: [TriviaComponent],
  templateUrl: './trivia-page.component.html',
  styleUrl: './trivia-page.component.scss',
})
export class TriviaPageComponent {}
