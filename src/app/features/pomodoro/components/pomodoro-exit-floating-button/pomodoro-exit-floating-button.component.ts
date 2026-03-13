import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { fabFadeAnimation, FloatingActionButtonComponent } from '../../../../shared';

type PomodoroExitFloatingButtonVariant = 'session' | 'mode';

@Component({
  selector: 'app-pomodoro-exit-floating-button',
  templateUrl: './pomodoro-exit-floating-button.component.html',
  imports: [FloatingActionButtonComponent],
  animations: [fabFadeAnimation],
  host: { '[@fabFade]': '' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PomodoroExitFloatingButtonComponent {
  readonly ariaLabel = input.required<string>();
  readonly tooltip = input.required<string>();
  readonly variant = input<PomodoroExitFloatingButtonVariant>('session');
  readonly clicked = output<void>();

  protected onClick(): void {
    this.clicked.emit();
  }
}
