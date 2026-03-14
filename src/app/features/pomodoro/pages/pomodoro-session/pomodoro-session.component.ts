import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import {
  ListTasksUseCase,
  Task,
  TaskPanelComponent,
  TaskSelectionService,
  TasksLoadingService,
  TASK_SELECTION_SERVICE_TOKEN,
  TASKS_LOADING_SERVICE_TOKEN,
} from '../../../tasks';
import { PomodoroFlowService } from '../../infrastructure/services/pomodoro-flow.service';
import {
  PomodoroExitFloatingButtonComponent,
  PomodoroSessionBackToIntroConfirmationModalComponent,
  PomodoroSessionStartFloatingButtonComponent,
} from '../../index';

@Component({
  selector: 'app-pomodoro-session',
  templateUrl: './pomodoro-session.component.html',
  styleUrl: './pomodoro-session.component.scss',
  imports: [
    PomodoroExitFloatingButtonComponent,
    PomodoroSessionStartFloatingButtonComponent,
    TaskPanelComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PomodoroSessionComponent {
  private readonly listTasksUseCase = inject(ListTasksUseCase);
  private readonly tasksLoadingService = inject<TasksLoadingService>(TASKS_LOADING_SERVICE_TOKEN);
  private readonly taskSelectionService = inject<TaskSelectionService>(TASK_SELECTION_SERVICE_TOKEN);
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
            this.exitToSetup();
          }
        });
      return;
    }

    this.exitToSetup();
  }

  private exitToSetup(): void {
    this.pomodoroFlowService.markSetupVisited();
    this.taskSelectionService.clearSelection();
    this.router.navigate(['/pomodoro/intro']);
  }

  protected onStartPomodoroSession(): void {
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
