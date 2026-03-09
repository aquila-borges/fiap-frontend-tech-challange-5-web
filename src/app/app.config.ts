import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AuthServiceImpl, AUTH_SERVICE_TOKEN } from './features/auth';
import { AccessibilityServiceImpl, ACCESSIBILITY_SERVICE_TOKEN } from './features/accessibility';
import { FIREBASE_AUTH_TOKEN } from './core/config/firebase/firebase-auth.token';
import { getFirebaseAuth } from './core/config/firebase/firebase.config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideBrowserGlobalErrorListeners(),
    provideAnimations(),
    {
      provide: AUTH_SERVICE_TOKEN,
      useExisting: AuthServiceImpl
    },
    {
      provide: ACCESSIBILITY_SERVICE_TOKEN,
      useExisting: AccessibilityServiceImpl
    },
    {
      provide: FIREBASE_AUTH_TOKEN,
      useFactory: () => getFirebaseAuth()
    }
  ]
};
