import { Component, signal } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  protected email = signal('');
  protected password = signal('');
  protected errorMessage = signal('');
  protected loading = signal(false);

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async onLogin(): Promise<void> {
    this.loading.set(true);
    this.errorMessage.set('');

    try {
      await this.authService.login(this.email(), this.password());
      console.log('Login realizado com sucesso!');
      // Redirecionar para página principal
      // this.router.navigate(['/dashboard']);
    } catch (error: any) {
      console.error('Erro no login:', error);
      this.errorMessage.set(this.getErrorMessage(error.code));
    } finally {
      this.loading.set(false);
    }
  }

  async onRegister(): Promise<void> {
    this.loading.set(true);
    this.errorMessage.set('');

    try {
      await this.authService.register(this.email(), this.password());
      console.log('Usuário registrado com sucesso!');
      // Redirecionar automaticamente após registro
      // this.router.navigate(['/dashboard']);
    } catch (error: any) {
      console.error('Erro no registro:', error);
      this.errorMessage.set(this.getErrorMessage(error.code));
    } finally {
      this.loading.set(false);
    }
  }

  private getErrorMessage(errorCode: string): string {
    const errorMessages: { [key: string]: string } = {
      'auth/email-already-in-use': 'Este email já está em uso',
      'auth/invalid-email': 'Email inválido',
      'auth/user-not-found': 'Usuário não encontrado',
      'auth/wrong-password': 'Senha incorreta',
      'auth/weak-password': 'Senha muito fraca (mínimo 6 caracteres)',
      'auth/invalid-credential': 'Credenciais inválidas'
    };

    return errorMessages[errorCode] || 'Erro ao realizar operação. Tente novamente.';
  }
}
