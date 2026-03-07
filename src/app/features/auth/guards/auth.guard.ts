import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.authService.getAuthState().pipe(
      map(user => {
        if (user) {
          return true; // Usuário autenticado, pode acessar
        }
        // Usuário não autenticado, redireciona para login
        return this.router.createUrlTree(['/login']);
      })
    );
  }
}
