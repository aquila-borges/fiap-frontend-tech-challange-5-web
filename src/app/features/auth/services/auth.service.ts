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
import { AuthCredentials } from '../domain/models/auth-credentials.model';
import { AuthService } from '../domain/interfaces/auth-service.interface';
import { User } from '../domain/entities/user.interface';
import { FIREBASE_AUTH_TOKEN } from '../../../core/config/firebase/firebase-auth.token';

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

  async register(credentials: AuthCredentials): Promise<User> {
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

  async loginWithGoogle(): Promise<User> {
    const userCredential = await signInWithPopup(this.auth, this.googleProvider);

    if (!userCredential.user.uid) {
      throw new Error('Google login failed: No user ID returned');
    }

    return this.mapFirebaseUser(userCredential.user);
  }

  async sendPasswordResetEmail(email: string): Promise<void> {
    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      throw new Error('Informe seu e-mail para recuperar a senha');
    }

    await sendPasswordResetEmail(this.auth, normalizedEmail);
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
