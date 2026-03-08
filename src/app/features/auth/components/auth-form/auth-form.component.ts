import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
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
  readonly loading = input(false);
  readonly errorMessage = input('');

  readonly loginSubmitted = output<void>();
  readonly registerRequested = output<void>();

  protected isControlInvalid(controlName: 'email' | 'password'): boolean {
    const control = this.form().controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  protected onSubmit(): void {
    this.loginSubmitted.emit();
  }

  protected onRegister(): void {
    this.registerRequested.emit();
  }
}
