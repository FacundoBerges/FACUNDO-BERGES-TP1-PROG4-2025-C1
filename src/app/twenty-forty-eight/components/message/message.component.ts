import { Component, Input } from '@angular/core';

@Component({
  selector: 'juegos-message',
  imports: [],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss',
})
export class MessageComponent {
  @Input() won: boolean = false;
  @Input() gameOver: boolean = false;
}
