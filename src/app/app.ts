import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  signal
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { distinctUntilChanged } from 'rxjs/operators';
import { Router, RouterOutlet, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { LoadingComponent, AppHeaderComponent, UserMenuComponent } from './shared';
import {
  AccessibilityFloatingButtonComponent,
  AccessibilityPanelComponent,
  AccessibilityService,
  ACCESSIBILITY_SERVICE_TOKEN,
  LoadLoggedUserAccessibilityPreferencesUseCase,
  SaveLoggedUserAccessibilityPreferencesUseCase,
} from './features/accessibility';
import { AuthService, AUTH_SERVICE_TOKEN } from './features/auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  imports: [
    RouterOutlet,
    LoadingComponent,
    AppHeaderComponent,
    UserMenuComponent,
    AccessibilityFloatingButtonComponent,
    AccessibilityPanelComponent,
  ],
  styleUrls: ['./app.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {
  protected loading = signal(false);
  protected showHeaderAndMenu = signal(false);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly authService = inject<AuthService>(AUTH_SERVICE_TOKEN);
  private readonly accessibilityService = inject<AccessibilityService>(ACCESSIBILITY_SERVICE_TOKEN);
  private readonly loadAccessibilityPreferencesUseCase = inject(LoadLoggedUserAccessibilityPreferencesUseCase);
  private readonly saveAccessibilityPreferencesUseCase = inject(SaveLoggedUserAccessibilityPreferencesUseCase);
  private readonly isAuthenticated = signal(false);
  private readonly hasGuestPreferenceChanges = signal(false);
  private hasInitializedGuestTracking = false;

  constructor() {
    this.setupGuestPreferenceTracking();
    this.setupAccessibilitySync();
    this.setupRouterEvents();
  }

  private setupGuestPreferenceTracking(): void {
    effect(() => {
      this.accessibilityService.getCurrentPreferences();

      if (this.isAuthenticated()) {
        return;
      }

      if (!this.hasInitializedGuestTracking) {
        this.hasInitializedGuestTracking = true;
        return;
      }

      this.hasGuestPreferenceChanges.set(true);
    });
  }

  private setupAccessibilitySync(): void {
    this.authService
      .getAuthState()
      .pipe(
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(isAuthenticated => {
        this.isAuthenticated.set(isAuthenticated);

        if (isAuthenticated) {
          void this.syncAccessibilityPreferencesOnLogin();
        }
      });
  }

  private async syncAccessibilityPreferencesOnLogin(): Promise<void> {
    if (this.hasGuestPreferenceChanges()) {
      await this.saveAccessibilityPreferencesUseCase.execute(
        this.accessibilityService.getCurrentPreferences()
      );
      this.hasGuestPreferenceChanges.set(false);
      return;
    }

    const preferences = await this.loadAccessibilityPreferencesUseCase.execute();

    if (preferences) {
      this.accessibilityService.applyPreferences(preferences);
    }
  }

  private setupRouterEvents(): void {
    this.router.events.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(event => {
      if (event instanceof NavigationStart) {
        this.loading.set(true);
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        this.loading.set(false);
      }

      if (event instanceof NavigationEnd) {
        // Show header and menu only on authenticated pages (not on login/auth pages)
        this.showHeaderAndMenu.set(event.urlAfterRedirects.startsWith('/dashboard'));
      }
    });
  }
}
