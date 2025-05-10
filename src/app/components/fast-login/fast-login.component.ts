import { Component, input, InputSignal, output, OutputEmitterRef } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { UserLoginData } from '../../interfaces/user-data';

@Component({
  selector: 'juegos-fast-login',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './fast-login.component.html',
  styleUrl: './fast-login.component.scss',
})
export class FastLoginComponent {
  public loginUser: InputSignal<string> = input.required<string>();
  public loginEmail: InputSignal<string> = input.required<string>();
  public loginPassword: InputSignal<string> = input.required<string>();
  public loginEmitter: OutputEmitterRef<UserLoginData> =
    output<UserLoginData>();

  public onLogin(): void {
    this.loginEmitter.emit({
      email: this.loginEmail(),
      password: this.loginPassword(),
    });
  }
}
