import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { GetInitialPomodoroViewModelUseCase } from '../../usecases';

@Component({
  selector: 'app-pomodoro',
  templateUrl: './pomodoro.component.html',
  styleUrl: './pomodoro.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PomodoroComponent {
  private readonly getInitialPomodoroViewModelUseCase = inject(GetInitialPomodoroViewModelUseCase);

  protected readonly model = signal(this.getInitialPomodoroViewModelUseCase.execute());
  protected readonly summary = computed(() => {
    const currentModel = this.model();
    return `${currentModel.focusMinutes} min foco, ${currentModel.shortBreakMinutes} min pausa curta e ${currentModel.longBreakMinutes} min pausa longa`;
  });
}
