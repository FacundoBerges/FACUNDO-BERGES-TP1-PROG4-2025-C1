import { Component, inject, signal, WritableSignal } from '@angular/core';

import { MatIconModule } from '@angular/material/icon';

import { ScrollBottomDirective } from '../../../directives/scroll-bottom.directive';
import { AuthService } from '../../../services/auth.service';
import { ChatService } from '../../../services/chat.service';
import { InputComponent } from './input/input.component';
import { SendedComponent } from './sended/sended.component';
import { ReceivedComponent } from './received/received.component';

@Component({
  selector: 'juegos-chat',
  imports: [MatIconModule, ReceivedComponent, SendedComponent, InputComponent, ScrollBottomDirective],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent {
  public chatService: ChatService = inject(ChatService);
  public authService: AuthService = inject(AuthService);
  public isChatboxOpen: WritableSignal<boolean> = signal<boolean>(false);

  public sendMessage(message: string): void {
    this.chatService.sendMessage(message);
  }

  public toggleChatbox(): void {
    this.isChatboxOpen.update((isOpen) => !isOpen);
  }
}
