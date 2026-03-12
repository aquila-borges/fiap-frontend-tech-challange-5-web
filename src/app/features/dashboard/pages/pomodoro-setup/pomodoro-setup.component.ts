import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { PomodoroPanelComponent } from '../../../pomodoro/components/pomodoro-panel/pomodoro-panel.component';

@Component({
  selector: 'app-pomodoro-setup',
  templateUrl: './pomodoro-setup.component.html',
  styleUrl: './pomodoro-setup.component.scss',
  imports: [PomodoroPanelComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PomodoroSetupComponent {
  private readonly router = inject(Router);

  protected onCloseRequested(): void {
    this.router.navigate(['/dashboard']);
  }

  protected onStartRequested(): void {
    this.router.navigate(['/dashboard/pomodoro/session']);
  }
}
