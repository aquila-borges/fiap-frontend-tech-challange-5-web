import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { fabFadeAnimation, FloatingActionButtonComponent } from '../../../../shared';

@Component({
  selector: 'app-pomodoro-session-start-floating-button',
  templateUrl: './pomodoro-session-start-floating-button.component.html',
  imports: [FloatingActionButtonComponent],
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
    this.clicked.emit();
  }
}
