import { Injectable } from '@angular/core';
import { 
  Auth, 
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthCredentials } from '../domain/models/auth-credentials';
import { IAuthService } from '../domain/interfaces/auth-service.interface';
import { IUser } from '../domain/entities/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements IAuthService {
  private auth: Auth | null = null;
  
  constructor() {}

  // Inicializa o Firebase Auth (chamar no AppModule ou no construtor)
  initializeAuth(auth: Auth): void {
    this.auth = auth;
  }

  // Observável do estado de autenticação
  getAuthState(): Observable<boolean> {
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
    }).pipe(map(user => !!user));
  }

  // Login com email e senha
  async login(credentials: AuthCredentials): Promise<IUser> {
    if (!this.auth) {
      throw new Error('Firebase Auth não inicializado');
    }
    const userCredential = await signInWithEmailAndPassword(
      this.auth,
      credentials.getEmail(),
      credentials.getPassword()
    );

    if (!userCredential.user.uid) {
      throw new Error('Login failed: No user ID returned');
    }

    return this.mapFirebaseUser(userCredential.user);
  }

  // Registro de novo usuário
  async register(credentials: AuthCredentials): Promise<IUser> {
    if (!this.auth) {
      throw new Error('Firebase Auth não inicializado');
    }
    const userCredential = await createUserWithEmailAndPassword(
      this.auth,
      credentials.getEmail(),
      credentials.getPassword()
    );

    if (!userCredential.user.uid) {
      throw new Error('Registration failed: No user ID returned');
    }

    return this.mapFirebaseUser(userCredential.user);
  }

  // Logout
  async logout(): Promise<void> {
    if (!this.auth) {
      throw new Error('Firebase Auth não inicializado');
    }
    return signOut(this.auth);
  }

  // Obter usuário atual
  getCurrentUser(): IUser | null {
    if (!this.auth?.currentUser) {
      return null;
    }

    return this.mapFirebaseUser(this.auth.currentUser);
  }

  private mapFirebaseUser(user: User): IUser {
    return {
      id: user.uid,
      email: user.email ?? '',
      createdAt: user.metadata.creationTime
        ? new Date(user.metadata.creationTime)
        : new Date(),
      lastLogin: user.metadata.lastSignInTime
        ? new Date(user.metadata.lastSignInTime)
        : undefined
    };
  }
}
