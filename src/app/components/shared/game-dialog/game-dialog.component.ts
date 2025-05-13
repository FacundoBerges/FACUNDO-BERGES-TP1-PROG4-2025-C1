import { Component, input, output } from '@angular/core';

import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'juegos-game-dialog',
  imports: [DialogModule, ButtonModule],
  templateUrl: './game-dialog.component.html',
  styleUrl: './game-dialog.component.scss',
})
export class GameDialogComponent {
  public showDialog = input<boolean>(false);
  public title = input<string>('Juego finalizado');
  public message = input.required<string>();
  public buttonText = input<string>('OK');
  public closeDialogEmitter = output<void>();

  public closeDialog(): void {
    this.closeDialogEmitter.emit();
  }
}
