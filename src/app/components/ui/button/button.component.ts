import { Component, input, InputSignal, output } from '@angular/core';

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
  public clickEmitter = output<void>();

  public onClick(): void {
    this.clickEmitter.emit();
  }
}
