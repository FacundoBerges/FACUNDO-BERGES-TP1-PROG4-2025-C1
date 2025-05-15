import { Component, input } from '@angular/core';

@Component({
  selector: 'juegos-game-explanation',
  imports: [],
  templateUrl: './game-explanation.component.html',
  styleUrl: './game-explanation.component.scss',
})
export class GameExplanationComponent {
  public explanation = input.required<string>();
  public controls = input.required<string>();
}
