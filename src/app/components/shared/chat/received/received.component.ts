import { Component, input, InputSignal } from '@angular/core';
import { DatePipe } from '@angular/common';

import { Message } from '../../../../interfaces/message';

@Component({
  selector: 'juegos-received',
  imports: [DatePipe],
  templateUrl: './received.component.html',
  styleUrl: './received.component.scss',
})
export class ReceivedComponent {
  public message: InputSignal<Message> = input.required<Message>();
}
