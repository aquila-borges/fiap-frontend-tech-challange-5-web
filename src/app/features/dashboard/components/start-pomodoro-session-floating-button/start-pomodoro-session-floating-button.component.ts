import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { MatIcon } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

const fabFade = trigger('fabFade', [
  transition(':enter', [
    style({ opacity: 0, transform: 'scale(0.7)' }),
    animate('180ms ease-out', style({ opacity: 1, transform: 'scale(1)' })),
  ]),
  transition(':leave', [
    animate('150ms ease-in', style({ opacity: 0, transform: 'scale(0.7)' })),
  ]),
]);

@Component({
  selector: 'app-start-pomodoro-session-floating-button',
  templateUrl: './start-pomodoro-session-floating-button.component.html',
  styleUrl: './start-pomodoro-session-floating-button.component.scss',
  imports: [MatIcon, MatTooltipModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fabFade],
  host: { '[@fabFade]': '' },
})
export class StartPomodoroSessionFloatingButtonComponent {
  readonly disabled = input(false);
  readonly startPomodoroClick = output<void>();

  protected onStartPomodoro(): void {
    if (this.disabled()) {
      return;
    }
    this.startPomodoroClick.emit();
  }
}
