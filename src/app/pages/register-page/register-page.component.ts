import { Component, inject } from '@angular/core';

import { AuthService } from '../../services/auth.service';
import { RegisterFormComponent } from '../../components/register-form/register-form.component';
import { UserRegisterData } from '../../interfaces/user-data';

@Component({
  selector: 'juegos-register-page',
  imports: [RegisterFormComponent],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.scss',
})
export class RegisterPageComponent {
  private _authService: AuthService = inject(AuthService);

  public registerUser(user: UserRegisterData): void {
    this._authService.signUp(user);
  }
}
