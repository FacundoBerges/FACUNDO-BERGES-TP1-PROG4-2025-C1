import { Component, input, InputSignal } from '@angular/core';

@Component({
  selector: 'juegos-hangman-word',
  imports: [],
  templateUrl: './hangman-word.component.html',
  styleUrl: './hangman-word.component.scss',
})
export class HangmanWordComponent {
  public hiddenWord: InputSignal<string> = input.required<string>();
}
