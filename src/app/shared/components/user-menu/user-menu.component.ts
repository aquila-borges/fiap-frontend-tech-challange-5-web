import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  TemplateRef,
  ViewChild,
  inject,
  signal
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { take } from 'rxjs';
import { AuthService, AUTH_SERVICE_TOKEN, User } from '../../../features/auth';
import { PrimaryButtonComponent } from '../primary-button/primary-button.component';
import { SecondaryButtonComponent } from '../secondary-button/secondary-button.component';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrl: './user-menu.component.scss',
  imports: [RouterLink, MatDialogModule, PrimaryButtonComponent, SecondaryButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserMenuComponent {
  @ViewChild('logoutConfirmDialog', { static: true })
  private logoutConfirmDialog!: TemplateRef<unknown>;

  protected readonly firstName = signal('Usuário');
  protected readonly isDropdownOpen = signal(false);
  protected readonly isDropdownClosing = signal(false);

  private readonly dialog = inject(MatDialog);
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

  protected toggleDropdown(): void {
    if (this.isDropdownOpen()) {
      this.closeDropdown();
    } else {
      this.isDropdownOpen.set(true);
      this.isDropdownClosing.set(false);
    }
  }

  protected closeDropdown(): void {
    this.isDropdownClosing.set(true);
    setTimeout(() => {
      this.isDropdownOpen.set(false);
      this.isDropdownClosing.set(false);
    }, 150);
  }

  protected openLogoutDialog(): void {
    this.closeDropdown();
    const dialogRef = this.dialog.open(this.logoutConfirmDialog, {
      minWidth: '380px'
    });

    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe(confirmed => {
        if (confirmed === true) {
          void this.confirmLogout();
        }
      });
  }

  private async confirmLogout(): Promise<void> {
    await this.authService.logout();
    await this.router.navigate(['/login']);
  }

  private getFirstName(user: User | null): string {
    if (!user) {
      return 'Usuário';
    }

    const rawName = user.name?.trim();

    if (rawName) {
      return this.toTitleCase(rawName.split(/\s+/)[0]);
    }

    const localPart = user.email.split('@')[0]?.trim();
    if (!localPart) {
      return 'Usuário';
    }

    const normalized = localPart.replace(/[._-]+/g, ' ');
    const first = normalized.split(/\s+/)[0];
    return first ? this.toTitleCase(first) : 'Usuário';
  }

  private toTitleCase(value: string): string {
    const lower = value.toLocaleLowerCase();
    return lower.charAt(0).toLocaleUpperCase() + lower.slice(1);
  }
}
