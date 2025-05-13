import { Component, input, InputSignal } from '@angular/core';
import { DatePipe, LowerCasePipe } from '@angular/common';

import { Message } from '../../../../interfaces/message';

@Component({
  selector: 'juegos-sended',
  imports: [DatePipe, LowerCasePipe],
  templateUrl: './sended.component.html',
  styleUrl: './sended.component.scss',
})
export class SendedComponent {
  public message: InputSignal<Message> = input.required<Message>();
}
