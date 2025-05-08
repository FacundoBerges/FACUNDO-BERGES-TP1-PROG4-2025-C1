import { Component, input, InputSignal } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';

import { GameButton } from '../../../interfaces/game-button';

@Component({
  selector: 'juegos-button',
  imports: [MatButtonModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  public button: InputSignal<GameButton> = input.required<GameButton>();
}
