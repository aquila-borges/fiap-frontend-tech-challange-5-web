import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

type AuthFormGroup = FormGroup<{
  email: FormControl<string>;
  password: FormControl<string>;
}>;

@Component({
  selector: 'app-auth-form',
  templateUrl: './auth-form.component.html',
  styleUrl: './auth-form.component.css',
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthFormComponent {
  readonly form = input.required<AuthFormGroup>();
  readonly disabled = input(false);

  protected isControlInvalid(controlName: 'email' | 'password'): boolean {
    const control = this.form().controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }
}
