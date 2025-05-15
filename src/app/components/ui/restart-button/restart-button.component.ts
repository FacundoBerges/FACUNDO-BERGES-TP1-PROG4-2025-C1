import { Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'juegos-restart-button',
  imports: [MatIconModule],
  templateUrl: './restart-button.component.html',
  styleUrl: './restart-button.component.scss',
})
export class RestartButtonComponent {
  public label = input<string>('Nuevo juego');
  public icon = input<string>('restart_alt');
  public restartGame = output<void>();

  public handleClick(): void {
    this.restartGame.emit();
  }
}
