import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { HeaderComponent } from './components/shared/header/header.component';
import { AuthService } from './services/auth.service';
import { ChatComponent } from './components/shared/chat/chat.component';

@Component({
  selector: 'juegos-root',
  imports: [RouterOutlet, HeaderComponent, ChatComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  public authService: AuthService = inject(AuthService);
}
