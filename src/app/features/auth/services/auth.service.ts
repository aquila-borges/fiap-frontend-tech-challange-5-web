import { inject, Injectable } from '@angular/core';
import { 
  Auth, 
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
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
      createdAt: user.metadata.creationTime
        ? new Date(user.metadata.creationTime)
        : new Date(),
      lastLogin: user.metadata.lastSignInTime
        ? new Date(user.metadata.lastSignInTime)
        : undefined
    };
  }
}
