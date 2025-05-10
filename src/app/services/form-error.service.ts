import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class FormErrorService {
  public getErrorMessage(
    controlName: string,
    form: FormGroup<any>
  ): string | void {
    const control: AbstractControl<any, any> | null = form.get(controlName);

    if (control?.hasError('required')) return 'Este campo es obligatorio.';

    if (control?.hasError('email')) return 'El formato del email es inválido.';

    if (control?.hasError('minlength')) {
      const minLength: number = control.getError('minlength').requiredLength;

      return `El mínimo de caracteres es ${minLength}.`;
    }

    if (control?.hasError('maxlength')) {
      const maxLength: number = control.getError('maxlength').requiredLength;

      return `El máximo de caracteres es ${maxLength}.`;
    }

    if (control?.hasError('min')) return 'El valor es menor al mínimo permitido.';

    if (control?.hasError('max')) return 'El valor es mayor al máximo permitido.';

    if (control?.hasError('pattern')) return 'El formato es inválido.';

    if (control?.hasError('emailTaken')) return 'El email ya está en uso.';

    if (control?.hasError('emailNotFound')) return 'El email no está registrado.';

    if (control?.hasError('passwordMismatch')) return 'Las contraseñas no coinciden.';

    if (control?.hasError('passwordStrength')) return 'La contraseña es demasiado débil.';
  }
}
