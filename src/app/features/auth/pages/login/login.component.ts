import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {
  LoginUsecase,
  LoginWithGoogleUsecase,
  RegisterUsecase,
  SendPasswordResetUsecase
} from '../../usecases';
import { NotificationService } from '../../../../core';
import { PrimaryButtonComponent, SecondaryButtonComponent, slideDownAnimation } from '../../../../shared';

/**
 * Presentation Layer: Login Page
 * Container component that orchestrates the login feature UI.
 * Uses usecases to coordinate business logic and domain models.
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  imports: [
    ReactiveFormsModule,
    NgOptimizedImage,
    PrimaryButtonComponent,
    SecondaryButtonComponent,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [slideDownAnimation],
})
export class LoginComponent {
  protected loading = signal(false);
  protected readonly showPassword = signal(false);
  protected readonly showConfirmPassword = signal(false);
  protected readonly isRegisterMode = signal(false);

  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private loginUsecase = inject(LoginUsecase);
  private loginWithGoogleUsecase = inject(LoginWithGoogleUsecase);
  private registerUsecase = inject(RegisterUsecase);
  private sendPasswordResetUsecase = inject(SendPasswordResetUsecase);
  private notificationService = inject(NotificationService);
  protected readonly logoPath = 'full_logo_default_theme.png';

  private readonly passwordsMatchValidator = (group: AbstractControl): ValidationErrors | null => {
    if (!this.isRegisterMode()) return null;
    const password = group.get('password')?.value as string;
    const confirmPassword = group.get('confirmPassword')?.value as string;
    if (!password || !confirmPassword) return null;
    return password === confirmPassword ? null : { passwordsMismatch: true };
  };

  protected form = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', []]
  }, { validators: [this.passwordsMatchValidator] });

  constructor() {
    effect(() => {
      if (this.loading()) {
        this.form.disable({ emitEvent: false });
        return;
      }

      this.form.enable({ emitEvent: false });
    });

    effect(() => {
      const confirmControl = this.form.controls.confirmPassword;
      if (this.isRegisterMode()) {
        confirmControl.setValidators([Validators.required]);
      } else {
        confirmControl.clearValidators();
      }
      confirmControl.updateValueAndValidity({ emitEvent: false });
      this.form.updateValueAndValidity({ emitEvent: false });
    });
  }

  protected isControlInvalid(controlName: 'email' | 'password'): boolean {
    const control = this.form.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  protected isConfirmPasswordInvalid(): boolean {
    const confirmControl = this.form.controls.confirmPassword;
    const touched = confirmControl.dirty || confirmControl.touched;
    return touched && (confirmControl.invalid || this.form.hasError('passwordsMismatch'));
  }

  protected togglePasswordVisibility(): void {
    this.showPassword.update((value) => !value);
  }

  protected toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword.update((value) => !value);
  }

  protected onSwitchToRegister(): void {
    const passwordControl = this.form.controls.password;
    passwordControl.reset('');
    passwordControl.markAsUntouched();
    passwordControl.markAsPristine();
    this.showPassword.set(false);
    this.isRegisterMode.set(true);
  }

  protected onBackToLogin(): void {
    const { password, confirmPassword } = this.form.controls;
    password.reset('');
    password.markAsUntouched();
    password.markAsPristine();
    confirmPassword.reset('');
    confirmPassword.markAsUntouched();
    confirmPassword.markAsPristine();
    this.showPassword.set(false);
    this.showConfirmPassword.set(false);
    this.isRegisterMode.set(false);
  }

  protected onSubmit(): void {
    if (this.isRegisterMode()) {
      this.onRegister();
    } else {
      this.onLogin();
    }
  }

  async onLogin(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);

    const { email, password } = this.form.getRawValue();

    const result = await this.loginUsecase.execute(email, password);

    if (result.isSuccess()) {
      await this.router.navigate(['/dashboard']);
    } else {
      this.notificationService.error(result.getError() || 'Erro ao realizar login.');
    }

    this.loading.set(false);
  }

  async onRegister(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);

    const { email, password } = this.form.getRawValue();

    const result = await this.registerUsecase.execute(email, password);

    if (result.isSuccess()) {
      this.notificationService.success('Conta criada com sucesso! Bem-vindo(a).');
      await this.router.navigate(['/dashboard']);
    } else {
      this.notificationService.error(result.getError() || 'Erro ao realizar registro.');
    }

    this.loading.set(false);
  }

  async onForgotPassword(): Promise<void> {
    const emailControl = this.form.controls.email;
    const email = emailControl.value;

    emailControl.markAsTouched();

    if (emailControl.invalid) {
      this.notificationService.warning('Informe um e-mail válido para recuperar sua senha.');
      return;
    }

    this.loading.set(true);

    try {
      await this.sendPasswordResetUsecase.execute(email);
      this.notificationService.success('Enviamos um link de recuperação para seu e-mail.');
    } catch (error: unknown) {
      this.notificationService.error(
        error instanceof Error ? error.message : 'Erro ao enviar recuperação de senha.'
      );
    }

    this.loading.set(false);
  }

  async onGoogleLogin(): Promise<void> {
    this.loading.set(true);

    const result = await this.loginWithGoogleUsecase.execute();

    if (result.isSuccess()) {
      await this.router.navigate(['/dashboard']);
    } else {
      this.notificationService.error(result.getError() || 'Erro ao realizar login com Google.');
    }

    this.loading.set(false);
  }

}
