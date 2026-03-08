import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DOCUMENT } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { AuthService } from '../../../features/auth/domain/interfaces/auth-service.interface';
import { AUTH_SERVICE_TOKEN } from '../../../features/auth/services/auth-service.token';
import { User } from '../../../features/auth/domain/entities/user.interface';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrl: './user-menu.component.css',
  imports: [RouterLink, FaIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserMenuComponent {
  protected readonly firstName = signal('Usuario');
  protected readonly isLogoutModalOpen = signal(false);
  protected readonly faUser = faUser;

  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly authService = inject<AuthService>(AUTH_SERVICE_TOKEN);

  constructor() {
    this.authService
      .getAuthState()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.firstName.set(this.getFirstName(this.authService.getCurrentUser()));
      });

    this.firstName.set(this.getFirstName(this.authService.getCurrentUser()));
  }

  protected openLogoutModal(): void {
    this.isLogoutModalOpen.set(true);
    this.document.querySelector('details.user-menu')?.removeAttribute('open');
  }

  protected closeLogoutModal(): void {
    this.isLogoutModalOpen.set(false);
  }

  protected async confirmLogout(): Promise<void> {
    this.closeLogoutModal();
    await this.authService.logout();
    await this.router.navigate(['/login']);
  }

  private getFirstName(user: User | null): string {
    if (!user) {
      return 'Usuario';
    }

    const rawName = user.name?.trim();

    if (rawName) {
      return this.toTitleCase(rawName.split(/\s+/)[0]);
    }

    const localPart = user.email.split('@')[0]?.trim();
    if (!localPart) {
      return 'Usuario';
    }

    const normalized = localPart.replace(/[._-]+/g, ' ');
    const first = normalized.split(/\s+/)[0];
    return first ? this.toTitleCase(first) : 'Usuario';
  }

  private toTitleCase(value: string): string {
    const lower = value.toLocaleLowerCase();
    return lower.charAt(0).toLocaleUpperCase() + lower.slice(1);
  }
}
