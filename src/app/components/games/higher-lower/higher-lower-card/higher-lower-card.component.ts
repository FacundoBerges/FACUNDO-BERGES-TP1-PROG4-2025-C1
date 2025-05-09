import { Component, input, InputSignal } from '@angular/core';

@Component({
  selector: 'juegos-higher-lower-card',
  imports: [],
  templateUrl: './higher-lower-card.component.html',
  styleUrl: './higher-lower-card.component.scss',
})
export class HigherLowerCardComponent {
  public cardName: InputSignal<string> = input.required<string>();

  public get cardSrc(): string {
    return `/assets/img/higher-lower/${this.cardName()}.png`;
  }
}
