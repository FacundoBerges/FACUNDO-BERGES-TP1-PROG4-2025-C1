import { Component, input, InputSignal } from '@angular/core';

import { Message } from '../../../../interfaces/message';

@Component({
  selector: 'juegos-sended',
  imports: [],
  templateUrl: './sended.component.html',
  styleUrl: './sended.component.scss',
})
export class SendedComponent {
  public message: InputSignal<Message> = input.required<Message>();
}
