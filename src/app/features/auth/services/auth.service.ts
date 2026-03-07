import { Injectable } from '@angular/core';
import { 
  Auth, 
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  UserCredential
} from 'firebase/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: Auth | null = null;
  
  constructor() {}

  // Inicializa o Firebase Auth (chamar no AppModule ou no construtor)
  initializeAuth(auth: Auth): void {
    this.auth = auth;
  }

  // Observável do estado de autenticação
  getAuthState(): Observable<User | null> {
    return new Observable(subscriber => {
      if (!this.auth) {
        subscriber.error('Firebase Auth não inicializado');
        return;
      }
      
      const unsubscribe = onAuthStateChanged(
        this.auth,
        (user) => subscriber.next(user),
        (error) => subscriber.error(error)
      );
      
      return () => unsubscribe();
    });
  }

  // Login com email e senha
  async login(email: string, password: string): Promise<UserCredential> {
    if (!this.auth) {
      throw new Error('Firebase Auth não inicializado');
    }
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  // Registro de novo usuário
  async register(email: string, password: string): Promise<UserCredential> {
    if (!this.auth) {
      throw new Error('Firebase Auth não inicializado');
    }
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  // Logout
  async logout(): Promise<void> {
    if (!this.auth) {
      throw new Error('Firebase Auth não inicializado');
    }
    return signOut(this.auth);
  }

  // Obter usuário atual
  getCurrentUser(): User | null {
    return this.auth?.currentUser || null;
  }
}
