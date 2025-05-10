import { Component, inject } from '@angular/core';

import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

import { LoginFormComponent } from '../../components/login-form/login-form.component';
import { FastLoginComponent } from "../../components/fast-login/fast-login.component";
import { AuthService } from '../../services/auth.service';
import { UserLoginData } from '../../interfaces/user-data';

@Component({
  selector: 'juegos-login-page',
  imports: [LoginFormComponent, ToastModule, FastLoginComponent],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
})
export class LoginPageComponent {
  private _authService: AuthService = inject(AuthService);
  private _messageService: MessageService = inject(MessageService);

  public loginUser(user: UserLoginData): void {
    this._authService.signIn(user).then((err) => {
      if (err) {
        console.error('Error logging in:', err);

        const message: string = 'Credenciales inválidas';

        this._messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: message,
        });

        return;
      }

      console.info('Login successful!');

      this._messageService.add({
        severity: 'success',
        summary: 'Éxito!',
        detail: 'Login exitoso!',
      });
    });
  }
}
