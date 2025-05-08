import { Component } from '@angular/core';

import { HangmanComponent } from '../../../components/games/hangman/hangman.component';

@Component({
  selector: 'juegos-hangman-page',
  imports: [HangmanComponent],
  templateUrl: './hangman-page.component.html',
  styleUrl: './hangman-page.component.scss',
})
export class HangmanPageComponent {}
