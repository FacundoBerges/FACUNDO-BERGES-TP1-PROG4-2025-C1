import { Component, input, InputSignal, output } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { GameButton } from '../../../interfaces/game-button';

@Component({
  selector: 'juegos-game-button',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './game-button.component.html',
  styleUrl: './game-button.component.scss',
})
export class GameButtonComponent {
  public button: InputSignal<GameButton> = input.required<GameButton>();
  public clickEmitter = output<void>();

  public onClick(): void {
    this.clickEmitter.emit();
  }
}
