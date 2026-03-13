import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { fabFadeAnimation } from '../../../../shared';

@Component({
  selector: 'app-pomodoro-floating-button',
  templateUrl: './pomodoro-floating-button.component.html',
  styleUrl: './pomodoro-floating-button.component.scss',
  imports: [MatTooltipModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fabFadeAnimation],
  host: { '[@fabFade]': '' },
})
export class PomodoroFloatingButtonComponent {
  readonly openPomodoroClick = output<void>();

  protected onOpenPomodoro(): void {
    this.openPomodoroClick.emit();
  }
}
