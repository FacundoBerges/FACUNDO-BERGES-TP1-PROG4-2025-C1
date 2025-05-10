import { Component, inject, output, OutputEmitterRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { UserLoginData } from '../../interfaces/user-data';
import { FormErrorService } from '../../services/form-error.service';

@Component({
  selector: 'juegos-login-form',
  imports: [ MatFormFieldModule, MatIconModule, MatInputModule, ReactiveFormsModule, RouterLink ],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss',
})
export class LoginFormComponent {
  private _formBuilder: FormBuilder = inject(FormBuilder);
  private _formErrorService: FormErrorService = inject(FormErrorService);
  public readonly userLoginEmitter: OutputEmitterRef<UserLoginData> = output<UserLoginData>();
  public loginForm: FormGroup = this._formBuilder.group({
    email: ['', [Validators.required, Validators.email, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });
  public showPassword: boolean = false;

  public get email(): AbstractControl<any, any> | null {
    return this.loginForm.get('email');
  }

  public get password(): AbstractControl<any, any> | null {
    return this.loginForm.get('password');
  }

  public getErrorMessage(controlName: string): string | void {
    return this._formErrorService.getErrorMessage(controlName, this.loginForm);
  }

  public onSubmit(): void {
    if (!this.loginForm.valid) {
      this.loginForm.markAllAsTouched();
      console.error('Login Form is invalid');
      return;
    }

    const userLoginData: UserLoginData = {
      email: this.email?.value,
      password: this.password?.value,
    };

    this.userLoginEmitter.emit(userLoginData);
  }

  public clearEmail(): void {
    this.email?.setValue('');
  }

  public togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
