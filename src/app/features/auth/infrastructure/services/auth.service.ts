import { inject, Injectable } from '@angular/core';
import {
  Auth,
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthCredentials, AuthService, User } from '../../domain';
import { FIREBASE_AUTH_TOKEN } from '../../../../core';
import { mapFirebaseAuthError } from './firebase-auth-error.util';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceImpl implements AuthService {
  private readonly auth = inject<Auth>(FIREBASE_AUTH_TOKEN);
  private readonly googleProvider = new GoogleAuthProvider();

  getAuthState(): Observable<boolean> {
    return new Observable(subscriber => {
      const unsubscribe = onAuthStateChanged(
        this.auth,
        (user) => subscriber.next(user),
        (error) => subscriber.error(error)
      );

      return () => unsubscribe();
    }).pipe(map(user => !!user));
  }

  async login(credentials: AuthCredentials): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        credentials.getEmail(),
        credentials.getPassword()
      );

      if (!userCredential.user.uid) {
        throw new Error('Não foi possível validar sua conta. Tente novamente.');
      }

      return this.mapFirebaseUser(userCredential.user);
    } catch (error: unknown) {
      throw mapFirebaseAuthError(error, 'Não foi possível entrar. Tente novamente.');
    }
  }

  async register(credentials: AuthCredentials): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        credentials.getEmail(),
        credentials.getPassword()
      );

      if (!userCredential.user.uid) {
        throw new Error('Não foi possível criar sua conta. Tente novamente.');
      }

      return this.mapFirebaseUser(userCredential.user);
    } catch (error: unknown) {
      throw mapFirebaseAuthError(error, 'Não foi possível criar sua conta. Tente novamente.');
    }
  }

  async loginWithGoogle(): Promise<User> {
    try {
      const userCredential = await signInWithPopup(this.auth, this.googleProvider);

      if (!userCredential.user.uid) {
        throw new Error('Não foi possível concluir o login com Google. Tente novamente.');
      }

      return this.mapFirebaseUser(userCredential.user);
    } catch (error: unknown) {
      throw mapFirebaseAuthError(error, 'Não foi possível entrar com Google. Tente novamente.');
    }
  }

  async sendPasswordResetEmail(email: string): Promise<void> {
    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      throw new Error('Informe seu e-mail para recuperar a senha.');
    }

    try {
      await sendPasswordResetEmail(this.auth, normalizedEmail);
    } catch (error: unknown) {
      throw mapFirebaseAuthError(
        error,
        'Não foi possível enviar o e-mail de recuperação. Tente novamente.'
      );
    }
  }

  async logout(): Promise<void> {
    return signOut(this.auth);
  }

  getCurrentUser(): User | null {
    if (!this.auth.currentUser) {
      return null;
    }

    return this.mapFirebaseUser(this.auth.currentUser);
  }

  private mapFirebaseUser(user: FirebaseUser): User {
    return {
      id: user.uid,
      email: user.email ?? '',
      name: user.displayName?.trim() || undefined,
      createdAt: user.metadata.creationTime
        ? new Date(user.metadata.creationTime)
        : new Date(),
      lastLogin: user.metadata.lastSignInTime
        ? new Date(user.metadata.lastSignInTime)
        : undefined
    };
  }
}