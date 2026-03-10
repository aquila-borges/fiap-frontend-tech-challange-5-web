import { ChangeDetectionStrategy, Component, signal, effect } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { UserMenuComponent } from '../user-menu/user-menu.component';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrl: './app-header.component.scss',
  imports: [RouterLink, RouterLinkActive, UserMenuComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppHeaderComponent {
  protected readonly isOnline = signal(navigator.onLine);

  constructor() {
    effect(() => {
      window.addEventListener('online', () => this.isOnline.set(true));
      window.addEventListener('offline', () => this.isOnline.set(false));
    });
  }
}
