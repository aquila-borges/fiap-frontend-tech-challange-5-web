import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { fabFadeAnimation } from '../../../../shared';

@Component({
  selector: 'app-pomodoro-session-start-floating-button',
  templateUrl: './pomodoro-session-start-floating-button.component.html',
  styleUrl: './pomodoro-session-start-floating-button.component.scss',
  imports: [MatIconModule, MatTooltipModule],
  animations: [fabFadeAnimation],
  host: { '[@fabFade]': '' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PomodoroSessionStartFloatingButtonComponent {
  readonly ariaLabel = input.required<string>();
  readonly tooltip = input.required<string>();
  readonly isTooltipDisabled = input(false);
  readonly isDisabled = input(false);
  readonly clicked = output<void>();

  protected onClick(): void {
    if (this.isDisabled()) {
      return;
    }

    this.clicked.emit();
  }
}
