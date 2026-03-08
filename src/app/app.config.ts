import { ApplicationConfig, APP_INITIALIZER, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideBrowserGlobalErrorListeners } from '@angular/core';
import { AuthService } from './features/auth/services/auth.service';
import { AUTH_SERVICE_TOKEN } from './features/auth/services/tokens/auth-service.token';
import { initializeFirebase, getFirebaseAuth } from './core/config/firebase.config';

// Factory para inicializar Firebase antes da aplicação iniciar
export function initializeApp(authService: AuthService) {
  return () => {
    initializeFirebase();
    const auth = getFirebaseAuth();
    authService.initializeAuth(auth);
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideBrowserGlobalErrorListeners(),
    {
      provide: AUTH_SERVICE_TOKEN,
      useExisting: AuthService
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AuthService],
      multi: true
    }
  ]
};
