import { Observable } from 'rxjs';
import { IUser } from '../entities/user.interface';
import { AuthCredentials } from '../models/auth-credentials';

/**
 * Application contract for authentication operations.
 * Implementations live in the infrastructure layer.
 */
export interface IAuthService {
  getAuthState(): Observable<boolean>;
  login(credentials: AuthCredentials): Promise<IUser>;
  register(credentials: AuthCredentials): Promise<IUser>;
  getCurrentUser(): IUser | null;
  logout(): Promise<void>;
}
