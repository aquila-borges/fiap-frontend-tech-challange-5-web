import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginUsecase, RegisterUsecase } from '../../usecases';
import { AuthFormComponent } from '../../components/auth-form/auth-form.component';

/**
 * Presentation Layer: Login Page
 * Container component that orchestrates the login feature UI.
 * Uses usecases to coordinate business logic and domain models.
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  imports: [ReactiveFormsModule, AuthFormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  protected errorMessage = signal('');
  protected loading = signal(false);

  private formBuilder = inject(FormBuilder);
  private loginUsecase = inject(LoginUsecase);
  private registerUsecase = inject(RegisterUsecase);

  protected form = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  async onLogin(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    const { email, password } = this.form.getRawValue();

    const result = await this.loginUsecase.execute(email, password);

    if (result.isSuccess()) {
      console.log('Login realizado com sucesso!');
      // this.router.navigate(['/dashboard']);
    } else {
      this.errorMessage.set(result.getError() || 'Erro ao realizar login');
    }

    this.loading.set(false);
  }

  async onRegister(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    const { email, password } = this.form.getRawValue();

    const result = await this.registerUsecase.execute(email, password);

    if (result.isSuccess()) {
      console.log('Usuário registrado com sucesso!');
      // this.router.navigate(['/dashboard']);
    } else {
      this.errorMessage.set(result.getError() || 'Erro ao realizar registro');
    }

    this.loading.set(false);
  }
}
