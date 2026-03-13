import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { fabFadeAnimation } from '../../../../shared';

@Component({
  selector: 'app-pomodoro-back-floating-button',
  templateUrl: './pomodoro-back-floating-button.component.html',
  styleUrl: './pomodoro-back-floating-button.component.scss',
  imports: [MatIconModule, MatTooltipModule],
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
