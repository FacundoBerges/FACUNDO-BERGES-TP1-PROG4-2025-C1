import { Component, inject, output, OutputEmitterRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { passwordMatchValidator } from '../../validators/validators';
import { UserRegisterData } from '../../interfaces/user-data';

@Component({
  selector: 'juegos-register-form',
  imports: [ MatFormFieldModule, MatIconModule, MatInputModule, ReactiveFormsModule, RouterLink ],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.scss',
})
export class RegisterFormComponent {
  private _formBuilder: FormBuilder = inject(FormBuilder);
  public readonly registerUserEmitter: OutputEmitterRef<UserRegisterData> = output<UserRegisterData>();
  public registerForm: FormGroup = this._formBuilder.nonNullable.group(
    {
      name: ['', [Validators.required, Validators.minLength(3)]],
      surname: ['', [Validators.required, Validators.minLength(3)]],
      age: ['', [Validators.required, Validators.min(1), Validators.max(99)]],
      email: ['', [Validators.required, Validators.email, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
    },
    { 
      validators: [passwordMatchValidator] 
    }
  );
  public showPassword: boolean = false;
  public showConfirmPassword: boolean = false;

  public get name(): AbstractControl<any, any> | null {
    return this.registerForm.get('name');
  }

  public get surname(): AbstractControl<any, any> | null {
    return this.registerForm.get('surname');
  }

  public get age(): AbstractControl<any, any> | null {
    return this.registerForm.get('age');
  }

  public get email(): AbstractControl<any, any> | null {
    return this.registerForm.get('email');
  }

  public get password(): AbstractControl<any, any> | null {
    return this.registerForm.get('password');
  }

  public get confirmPassword(): AbstractControl<any, any> | null {
    return this.registerForm.get('confirmPassword');
  }

  public onSubmit(): void {
    if (!this.registerForm.valid) {
      this.registerForm.markAllAsTouched();
      console.error('Login Form is invalid');
      return;
    }

    const registerUser: UserRegisterData = {
      name: this.name?.value,
      surname: this.surname?.value,
      age: this.age?.value,
      email: this.email?.value,
      password: this.password?.value,
    };

    this.registerUserEmitter.emit(registerUser);

    console.log('Login Form Submitted:', this.registerForm.value);
  }

  public clearName(): void {
    this.name?.setValue('');
  }

  public clearSurname(): void {
    this.surname?.setValue('');
  }

  public clearEmail(): void {
    this.email?.setValue('');
  }

  public togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  public toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
}
