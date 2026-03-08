import { inject, Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../../features/auth/domain/interfaces/auth-service.interface';
import { AUTH_SERVICE_TOKEN } from '../../features/auth/services/tokens/auth-service.token';

/**
 * Core Layer: Auth Guard
 * Application-wide route guard for protecting routes that require authentication.
 * This is an infrastructure concern shared across the application.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  private authService = inject<AuthService>(AUTH_SERVICE_TOKEN);
  private router = inject(Router);

  canActivate(): Observable<boolean | UrlTree> {
    return this.authService.getAuthState().pipe(
      map(isAuthenticated => {
        if (isAuthenticated) {
          return true;
        }
        return this.router.createUrlTree(['/login']);
      })
    );
  }
}
