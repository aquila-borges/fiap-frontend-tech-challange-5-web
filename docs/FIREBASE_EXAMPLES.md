# 🔐 Exemplos de Uso - Firebase Authentication

## Exemplo 1: Componente com Perfil do Usuário

```typescript
import { Component, OnInit, signal } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-profile',
  template: `
    <div class="profile">
      @if (user(); as currentUser) {
        <h2>Bem-vindo!</h2>
        <p><strong>Email:</strong> {{ currentUser.email }}</p>
        <p><strong>UID:</strong> {{ currentUser.uid }}</p>
        <p><strong>Criado em:</strong> {{ currentUser.metadata.creationTime }}</p>
        <button (click)="logout()">Sair</button>
      } @else {
        <p>Carregando...</p>
      }
    </div>
  `,
  standalone: false
})
export class ProfileComponent implements OnInit {
  protected user = signal<any>(null);

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.getAuthState().subscribe(user => {
      this.user.set(user);
    });
  }

  async logout() {
    await this.authService.logout();
    // Redirecionar para login
  }
}
```

---

## Exemplo 2: Interceptor para Requisições Autenticadas

```typescript
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { from, switchMap } from 'rxjs';
import { AuthService } from './services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return from(this.getToken()).pipe(
      switchMap(token => {
        if (token) {
          req = req.clone({
            setHeaders: { Authorization: `Bearer ${token}` }
          });
        }
        return next.handle(req);
      })
    );
  }

  private async getToken(): Promise<string | null> {
    const user = this.authService.getCurrentUser();
    return user ? await user.getIdToken() : null;
  }
}

// Registrar no app-module.ts:
// providers: [
//   { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
// ]
```

---

## Exemplo 3: Login com Google (OAuth)

Primeiro, habilite Google Sign-In no Firebase Console.

```typescript
// Adicione ao auth.service.ts:
import { 
  signInWithPopup, 
  GoogleAuthProvider 
} from 'firebase/auth';

async loginWithGoogle(): Promise<UserCredential> {
  if (!this.auth) {
    throw new Error('Firebase Auth não inicializado');
  }
  const provider = new GoogleAuthProvider();
  return signInWithPopup(this.auth, provider);
}

// Use no componente:
async onGoogleLogin() {
  try {
    await this.authService.loginWithGoogle();
    console.log('Login com Google realizado!');
  } catch (error) {
    console.error('Erro:', error);
  }
}
```

---

## Exemplo 4: Recuperação de Senha

```typescript
// Adicione ao auth.service.ts:
import { sendPasswordResetEmail } from 'firebase/auth';

async resetPassword(email: string): Promise<void> {
  if (!this.auth) {
    throw new Error('Firebase Auth não inicializado');
  }
  return sendPasswordResetEmail(this.auth, email);
}

// Use no componente:
async onForgotPassword() {
  try {
    await this.authService.resetPassword('usuario@email.com');
    alert('Email de recuperação enviado!');
  } catch (error) {
    console.error('Erro:', error);
  }
}
```

---

## Exemplo 5: Atualizar Perfil do Usuário

```typescript
// Adicione ao auth.service.ts:
import { updateProfile } from 'firebase/auth';

async updateUserProfile(displayName: string, photoURL?: string): Promise<void> {
  const user = this.getCurrentUser();
  if (!user) {
    throw new Error('Nenhum usuário logado');
  }
  return updateProfile(user, { displayName, photoURL });
}

// Use no componente:
async onUpdateProfile() {
  try {
    await this.authService.updateUserProfile('João Silva', 'https://...');
    console.log('Perfil atualizado!');
  } catch (error) {
    console.error('Erro:', error);
  }
}
```

---

## Exemplo 6: Verificação de Email

```typescript
// Adicione ao auth.service.ts:
import { sendEmailVerification } from 'firebase/auth';

async sendVerificationEmail(): Promise<void> {
  const user = this.getCurrentUser();
  if (!user) {
    throw new Error('Nenhum usuário logado');
  }
  return sendEmailVerification(user);
}

// Verificar se o email foi confirmado:
isEmailVerified(): boolean {
  const user = this.getCurrentUser();
  return user?.emailVerified || false;
}

// Use no componente:
async onSendVerification() {
  try {
    await this.authService.sendVerificationEmail();
    alert('Email de verificação enviado!');
  } catch (error) {
    console.error('Erro:', error);
  }
}
```

---

## Exemplo 7: Proteção Condicional no Template

```typescript
// No componente:
protected isAuthenticated = signal(false);
protected isAdmin = signal(false);

ngOnInit() {
  this.authService.getAuthState().subscribe(async user => {
    this.isAuthenticated.set(!!user);
    
    if (user) {
      // Verificar claims customizados (configurados no Firebase)
      const token = await user.getIdTokenResult();
      this.isAdmin.set(token.claims['admin'] === true);
    }
  });
}

// No template:
@if (isAuthenticated()) {
  <div class="user-menu">
    <span>Bem-vindo!</span>
    @if (isAdmin()) {
      <a routerLink="/admin">Painel Admin</a>
    }
    <button (click)="logout()">Sair</button>
  </div>
} @else {
  <a routerLink="/login">Entrar</a>
}
```

---

## Exemplo 8: Múltiplos Guards

```typescript
// admin.guard.ts
import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.authService.getAuthState().pipe(
      map(async user => {
        if (!user) {
          return this.router.createUrlTree(['/login']);
        }
        
        const token = await user.getIdTokenResult();
        if (token.claims['admin'] === true) {
          return true;
        }
        
        return this.router.createUrlTree(['/unauthorized']);
      })
    );
  }
}

// Usar na rota:
{
  path: 'admin',
  component: AdminComponent,
  canActivate: [AuthGuard, AdminGuard]  // Múltiplos guards
}
```

---

## Exemplo 9: Persistência de Sessão

```typescript
// firebase.config.ts - adicionar configuração de persistência
import { 
  setPersistence, 
  browserLocalPersistence,
  browserSessionPersistence 
} from 'firebase/auth';

export async function initializeFirebase(): Promise<void> {
  firebaseApp = initializeApp(environment.firebase);
  auth = getAuth(firebaseApp);
  
  // Persistir sessão mesmo após fechar o navegador
  await setPersistence(auth, browserLocalPersistence);
  
  // OU: Persistir apenas durante a sessão do navegador
  // await setPersistence(auth, browserSessionPersistence);
}
```

---

## Exemplo 10: Loading State Global

```typescript
// loading.service.ts
import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingCount = 0;
  public isLoading = signal(false);

  show() {
    this.loadingCount++;
    this.isLoading.set(true);
  }

  hide() {
    this.loadingCount = Math.max(0, this.loadingCount - 1);
    if (this.loadingCount === 0) {
      this.isLoading.set(false);
    }
  }
}

// Use no auth.service.ts:
constructor(private loadingService: LoadingService) {}

async login(email: string, password: string): Promise<UserCredential> {
  this.loadingService.show();
  try {
    return await signInWithEmailAndPassword(this.auth!, email, password);
  } finally {
    this.loadingService.hide();
  }
}

// Adicione no app.component.html:
@if (loadingService.isLoading()) {
  <div class="global-loader">
    <div class="spinner"></div>
  </div>
}
```

---

## 📚 Dicas de Boas Práticas

1. **Sempre trate erros:** Use try/catch em operações assíncronas
2. **Desinscreva observables:** Use `takeUntil` ou `async pipe`
3. **Valide inputs:** Email formato correto, senha mínimo 6 caracteres
4. **Feedback visual:** Mostre loading estados e mensagens de erro
5. **Segurança:** Nunca exponha tokens ou credenciais no frontend
6. **Testes:** Configure regras de segurança no Firebase Console

---

**Próximos passos:** Explore Firestore, Storage e Cloud Functions!
