import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { fabFadeAnimation, FloatingActionButtonComponent } from '../../../../shared';

@Component({
  selector: 'app-pomodoro-back-floating-button',
  templateUrl: './pomodoro-back-floating-button.component.html',
  imports: [FloatingActionButtonComponent],
  animations: [fabFadeAnimation],
  host: { '[@fabFade]': '' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PomodoroBackFloatingButtonComponent {
  readonly ariaLabel = input.required<string>();
  readonly tooltip = input.required<string>();
  readonly clicked = output<void>();

  protected onClick(): void {
    this.clicked.emit();
  }
}
