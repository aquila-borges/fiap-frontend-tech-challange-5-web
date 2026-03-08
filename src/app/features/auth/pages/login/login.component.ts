import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faInstagram, faFacebook, faLinkedin, faXTwitter } from '@fortawesome/free-brands-svg-icons';
import {
  LoginUsecase,
  RegisterUsecase
} from '../../usecases';
import { LoginWithGoogleUsecase } from '../../usecases/login-with-google.use-case';
import { SendPasswordResetUsecase } from '../../usecases/send-password-reset.use-case';

/**
 * Presentation Layer: Login Page
 * Container component that orchestrates the login feature UI.
 * Uses usecases to coordinate business logic and domain models.
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  imports: [ReactiveFormsModule, NgOptimizedImage, FaIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  protected errorMessage = signal('');
  protected loading = signal(false);
  protected readonly faInstagram = faInstagram;
  protected readonly faFacebook = faFacebook;
  protected readonly faLinkedin = faLinkedin;
  protected readonly faXTwitter = faXTwitter;

  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private loginUsecase = inject(LoginUsecase);
  private loginWithGoogleUsecase = inject(LoginWithGoogleUsecase);
  private registerUsecase = inject(RegisterUsecase);
  private sendPasswordResetUsecase = inject(SendPasswordResetUsecase);
  protected successMessage = signal('');
  protected readonly logoPath = 'full_logo_default_theme.png';

  protected form = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  constructor() {
    effect(() => {
      if (this.loading()) {
        this.form.disable({ emitEvent: false });
        return;
      }

      this.form.enable({ emitEvent: false });
    });
  }

  protected isControlInvalid(controlName: 'email' | 'password'): boolean {
    const control = this.form.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  async onLogin(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    const { email, password } = this.form.getRawValue();

    const result = await this.loginUsecase.execute(email, password);

    if (result.isSuccess()) {
      await this.router.navigate(['/dashboard']);
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
    this.successMessage.set('');

    const { email, password } = this.form.getRawValue();

    const result = await this.registerUsecase.execute(email, password);

    if (result.isSuccess()) {
      await this.router.navigate(['/dashboard']);
    } else {
      this.errorMessage.set(result.getError() || 'Erro ao realizar registro');
    }

    this.loading.set(false);
  }

  async onForgotPassword(): Promise<void> {
    this.errorMessage.set('');
    this.successMessage.set('');

    const emailControl = this.form.controls.email;
    const email = emailControl.value;

    emailControl.markAsTouched();

    if (emailControl.invalid) {
      this.errorMessage.set('Informe um email valido para recuperar sua senha');
      return;
    }

    this.loading.set(true);

    try {
      await this.sendPasswordResetUsecase.execute(email);
      this.successMessage.set('Enviamos um link de recuperacao para seu email');
    } catch (error: unknown) {
      this.errorMessage.set(
        error instanceof Error ? error.message : 'Erro ao enviar recuperacao de senha'
      );
    }

    this.loading.set(false);
  }

  async onGoogleLogin(): Promise<void> {
    this.loading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    const result = await this.loginWithGoogleUsecase.execute();

    if (result.isSuccess()) {
      await this.router.navigate(['/dashboard']);
    } else {
      this.errorMessage.set(result.getError() || 'Erro ao realizar login com Google');
    }

    this.loading.set(false);
  }

}
