import { Component, inject } from '@angular/core';

import { LoginFormComponent } from '../../components/login-form/login-form.component';
import { AuthService } from '../../services/auth.service';
import { UserLoginData } from '../../interfaces/user-data';

@Component({
  selector: 'juegos-login-page',
  imports: [LoginFormComponent],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
})
export class LoginPageComponent {
  private _authService: AuthService = inject(AuthService);

  public loginUser(user: UserLoginData): void {
    console.log('Login user:', user);
    
    this._authService.signIn(user);
  }
}
