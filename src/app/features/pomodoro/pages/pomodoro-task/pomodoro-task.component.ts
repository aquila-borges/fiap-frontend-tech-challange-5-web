import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import {
  ListActiveTasksUseCase,
  Task,
  TaskPanelComponent,
  TaskSelectionService,
  TasksLoadingService,
  TASK_SELECTION_SERVICE_TOKEN,
  TASKS_LOADING_SERVICE_TOKEN,
} from '../../../tasks';
import { POMODORO_DEFAULTS } from '../../domain';
import { PomodoroFlowService } from '../../infrastructure/services/pomodoro-flow.service';
import {
  CalculatePomodoroSessionEstimateUseCase,
  PomodoroExitFloatingButtonComponent,
  PomodoroSessionBackToIntroConfirmationModalComponent,
  PomodoroSessionStartFloatingButtonComponent,
} from '../../index';

@Component({
  selector: 'app-pomodoro-task',
  templateUrl: './pomodoro-task.component.html',
  styleUrl: './pomodoro-task.component.scss',
  imports: [
    PomodoroExitFloatingButtonComponent,
    PomodoroSessionStartFloatingButtonComponent,
    TaskPanelComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PomodoroTaskComponent {
  private readonly listTasksUseCase = inject(ListActiveTasksUseCase);
  private readonly tasksLoadingService = inject<TasksLoadingService>(TASKS_LOADING_SERVICE_TOKEN);
  private readonly taskSelectionService = inject<TaskSelectionService>(TASK_SELECTION_SERVICE_TOKEN);
  private readonly calculateEstimateUseCase = inject(CalculatePomodoroSessionEstimateUseCase);
  private readonly pomodoroFlowService = inject(PomodoroFlowService);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly tasks = signal<Task[]>([]);
  protected readonly isLoadingTasks = this.tasksLoadingService.isLoadingTasks;
  protected readonly hasTasks = computed(() => this.tasks().length > 0);
  protected readonly isStartDisabled = computed(
    () => this.taskSelectionService.selectedCount() === 0
  );

  protected readonly estimate = computed(() =>
    this.calculateEstimateUseCase.execute({
      taskCount: this.taskSelectionService.selectedCount(),
      completedCycles: 0,
      remainingSecondsInCurrentPhase: POMODORO_DEFAULTS.focusMinutes * 60,
      currentPhase: 'focus',
    })
  );

  constructor() {
    this.loadTasks();
    this.pomodoroFlowService.markSessionVisited();

    this.destroyRef.onDestroy(() => undefined);
  }

  protected onExitPomodoroMode(): void {
    if (this.taskSelectionService.selectedCount() > 0) {
      this.dialog
        .open(PomodoroSessionBackToIntroConfirmationModalComponent, {
          maxWidth: '90vw',
        })
        .afterClosed()
        .subscribe(confirmed => {
          if (confirmed) {
            this.exitToIntro();
          }
        });
      return;
    }

    this.exitToIntro();
  }

  private exitToIntro(): void {
    this.pomodoroFlowService.markIntroVisited();
    this.taskSelectionService.clearSelection();
    this.router.navigate(['/pomodoro/intro']);
  }

  protected onStartPomodoroTask(): void {
    if (this.taskSelectionService.selectedCount() === 0) {
      return;
    }

    this.router.navigate(['/pomodoro/mode']);
  }

  private loadTasks(): void {
    this.tasksLoadingService.setLoadingTasks(true);
    this.listTasksUseCase
      .execute()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: tasks => {
          this.tasks.set(tasks);
          this.tasksLoadingService.setLoadingTasks(false);
        },
        error: () => {
          this.tasks.set([]);
          this.tasksLoadingService.setLoadingTasks(false);
        },
      });
  }
}
