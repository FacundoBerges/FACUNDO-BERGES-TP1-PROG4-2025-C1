import { Component, output, OutputEmitterRef } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'juegos-input',
  imports: [FormsModule],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
})
export class InputComponent {
  public messageEmitter: OutputEmitterRef<string> = output<string>();
  public newMessage: string = '';

  public sendMessage(): void {
    const userMessage = this.newMessage.trim();

    if (userMessage === '') return;

    this.messageEmitter.emit(userMessage);
    this.newMessage = '';
  }
}
