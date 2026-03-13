import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TaskSelectionService, TASK_SELECTION_SERVICE_TOKEN } from '../../../tasks';
import { PrimaryButtonComponent, SecondaryButtonComponent } from '../../../../shared';
import { GetInitialPomodoroViewModelUseCase } from '../../usecases';

@Component({
  selector: 'app-pomodoro-setup',
  templateUrl: './pomodoro-setup.component.html',
  styleUrl: './pomodoro-setup.component.scss',
  imports: [PrimaryButtonComponent, SecondaryButtonComponent, NgOptimizedImage, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PomodoroSetupComponent {
  private readonly router = inject(Router);
  private readonly taskSelectionService = inject<TaskSelectionService>(TASK_SELECTION_SERVICE_TOKEN);
  private readonly getInitialPomodoroViewModelUseCase = inject(GetInitialPomodoroViewModelUseCase);

  protected readonly model = signal(this.getInitialPomodoroViewModelUseCase.execute());
  protected readonly summary = computed(() => {
    const currentModel = this.model();
    return `${currentModel.focusMinutes} min de foco, ${currentModel.shortBreakMinutes} min de pausa curta e ${currentModel.longBreakMinutes} min de pausa longa após ${currentModel.longBreakInterval} ciclos`;
  });

  constructor() {
    this.taskSelectionService.clearSelection();
  }

  protected onCloseRequested(): void {
    this.router.navigate(['/dashboard']);
  }

  protected onStartRequested(): void {
    this.router.navigate(['/pomodoro/session']);
  }
}
