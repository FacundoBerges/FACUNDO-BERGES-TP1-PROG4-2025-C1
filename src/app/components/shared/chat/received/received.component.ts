import { Component, input, InputSignal } from '@angular/core';
import { DatePipe, LowerCasePipe } from '@angular/common';

import { Message } from '../../../../interfaces/message';

@Component({
  selector: 'juegos-received',
  imports: [DatePipe, LowerCasePipe],
  templateUrl: './received.component.html',
  styleUrl: './received.component.scss',
})
export class ReceivedComponent {
  public message: InputSignal<Message> = input.required<Message>();
}
