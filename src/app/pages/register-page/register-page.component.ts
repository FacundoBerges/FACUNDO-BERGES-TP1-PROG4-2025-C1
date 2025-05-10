import { Component, inject } from '@angular/core';

import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

import { AuthService } from '../../services/auth.service';
import { RegisterFormComponent } from '../../components/register-form/register-form.component';
import { UserRegisterData } from '../../interfaces/user-data';

@Component({
  selector: 'juegos-register-page',
  imports: [RegisterFormComponent, ToastModule],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.scss',
  providers: [MessageService],
})
export class RegisterPageComponent {
  private _authService: AuthService = inject(AuthService);
  private _messageService = inject(MessageService);

  public registerUser(user: UserRegisterData): void {
    this._authService.signUp(user).then((err) => {
      if (err) {
        console.error('Error signing up:', err);

        let message: string = 'Error al registrar el usuario';

        switch (err.code) {
          case 'user_already_exists':
            message = 'El usuario ya existe';
            break;
          case 'invalid_email':
            message = 'El correo electrónico es inválido';
            break;
          case 'invalid_password':
            message = 'La contraseña es inválida';
            break;
          default:
            message = err.message;
            break;
        }

        this._messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: message,
        });

        return;
      }

      console.info('User registered successfully!');

      this._messageService.add({
        severity: 'success',
        summary: 'Éxito!',
        detail: 'Usuario registrado correctamente!',
      });
    });
  }
}
