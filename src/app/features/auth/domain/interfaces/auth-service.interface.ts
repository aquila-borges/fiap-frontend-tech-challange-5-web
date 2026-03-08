import { Observable } from 'rxjs';
import { User } from '../entities/user.interface';
import { AuthCredentials } from '../models/auth-credentials.model';

/**
 * Application contract for authentication operations.
 * Implementations live in the infrastructure layer.
 */
export interface AuthService {
  getAuthState(): Observable<boolean>;
  login(credentials: AuthCredentials): Promise<User>;
  register(credentials: AuthCredentials): Promise<User>;
  getCurrentUser(): User | null;
  logout(): Promise<void>;
}
