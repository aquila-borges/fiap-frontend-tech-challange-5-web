import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { ListActiveTasksUseCase, TaskSelectionService, TASK_SELECTION_SERVICE_TOKEN } from '../../../tasks';
import { PrimaryButtonComponent, SecondaryButtonComponent } from '../../../../shared';
import { PomodoroFlowService } from '../../infrastructure/services/pomodoro-flow.service';
import { GetInitialPomodoroViewModelUseCase } from '../../usecases';

@Component({
  selector: 'app-pomodoro-intro',
  templateUrl: './pomodoro-intro.component.html',
  styleUrl: './pomodoro-intro.component.scss',
  imports: [PrimaryButtonComponent, SecondaryButtonComponent, NgOptimizedImage, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PomodoroIntroComponent {
  private readonly router = inject(Router);
  private readonly listTasksUseCase = inject(ListActiveTasksUseCase);
  private readonly taskSelectionService = inject<TaskSelectionService>(TASK_SELECTION_SERVICE_TOKEN);
  private readonly pomodoroFlowService = inject(PomodoroFlowService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly getInitialPomodoroViewModelUseCase = inject(GetInitialPomodoroViewModelUseCase);

  protected readonly model = signal(this.getInitialPomodoroViewModelUseCase.execute());
  protected readonly hasTasks = signal<boolean | null>(null);
  protected readonly isStartDisabled = computed(() => this.hasTasks() !== true);
  protected readonly summary = computed(() => {
    const currentModel = this.model();
    return `${currentModel.focusMinutes} min de foco, ${currentModel.shortBreakMinutes} min de pausa curta e ${currentModel.longBreakMinutes} min de pausa longa após ${currentModel.longBreakInterval} ciclos`;
  });

  constructor() {
    this.taskSelectionService.clearSelection();
    this.pomodoroFlowService.markIntroVisited();
    this.checkHasTasks();
  }

  protected onCloseRequested(): void {
    this.router.navigate(['/dashboard']);
  }

  protected onStartRequested(): void {
    if (this.isStartDisabled()) {
      return;
    }

    this.router.navigate(['/pomodoro/task']);
  }

  private checkHasTasks(): void {
    this.listTasksUseCase
      .execute()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: tasks => {
          this.hasTasks.set(tasks.length > 0);
        },
        error: () => {
          this.hasTasks.set(false);
        },
      });
  }
}
