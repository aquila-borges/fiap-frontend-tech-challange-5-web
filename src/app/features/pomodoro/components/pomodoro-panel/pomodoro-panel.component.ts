import { ChangeDetectionStrategy, Component, computed, inject, output, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { PrimaryButtonComponent, SecondaryButtonComponent } from '../../../../shared';
import { GetInitialPomodoroViewModelUseCase } from '../../usecases';

@Component({
  selector: 'app-pomodoro-panel',
  templateUrl: './pomodoro-panel.component.html',
  styleUrl: './pomodoro-panel.component.scss',
  imports: [PrimaryButtonComponent, SecondaryButtonComponent, NgOptimizedImage],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PomodoroPanelComponent {
  readonly closeRequested = output<void>();

  private readonly getInitialPomodoroViewModelUseCase = inject(GetInitialPomodoroViewModelUseCase);

  protected readonly model = signal(this.getInitialPomodoroViewModelUseCase.execute());
  protected readonly summary = computed(() => {
    const currentModel = this.model();
    return `${currentModel.focusMinutes} min de foco, ${currentModel.shortBreakMinutes} min de pausa curta e ${currentModel.longBreakMinutes} min de pausa longa após ${currentModel.longBreakInterval} ciclos`;
  });

  protected onCloseRequested(): void {
    this.closeRequested.emit();
  }
}