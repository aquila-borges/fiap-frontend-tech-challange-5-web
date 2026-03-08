import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterOutlet, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { LoadingComponent } from './shared/components/loading/loading.component';
import { AppHeaderComponent } from './shared/components/app-header/app-header.component';
import { UserMenuComponent } from './shared/components/user-menu/user-menu.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  imports: [RouterOutlet, LoadingComponent, AppHeaderComponent, UserMenuComponent],
  styleUrls: ['./app.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {
  protected loading = signal(false);
  protected showHeaderAndMenu = signal(false);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
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
