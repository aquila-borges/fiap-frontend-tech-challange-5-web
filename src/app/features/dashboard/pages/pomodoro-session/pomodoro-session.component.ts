import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ExitPomodoroModeFloatingButtonComponent,
  StartPomodoroSessionFloatingButtonComponent,
} from '../../components/index';
import {
  ListTasksUseCase,
  Task,
  TaskPanelComponent,
  TaskSelectionService,
  TasksLoadingService,
  TASK_SELECTION_SERVICE_TOKEN,
  TASKS_LOADING_SERVICE_TOKEN,
} from '../../../tasks';

@Component({
  selector: 'app-pomodoro-session',
  templateUrl: './pomodoro-session.component.html',
  styleUrl: './pomodoro-session.component.scss',
  imports: [
    ExitPomodoroModeFloatingButtonComponent,
    StartPomodoroSessionFloatingButtonComponent,
    TaskPanelComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PomodoroSessionComponent {
  private readonly listTasksUseCase = inject(ListTasksUseCase);
  private readonly tasksLoadingService = inject<TasksLoadingService>(TASKS_LOADING_SERVICE_TOKEN);
  private readonly taskSelectionService = inject<TaskSelectionService>(TASK_SELECTION_SERVICE_TOKEN);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly tasks = signal<Task[]>([]);
  protected readonly isLoadingTasks = this.tasksLoadingService.isLoadingTasks;

  constructor() {
    this.taskSelectionService.clearSelection();
    this.loadTasks();

    this.destroyRef.onDestroy(() => {
      this.taskSelectionService.clearSelection();
    });
  }

  protected onExitPomodoroMode(): void {
    this.taskSelectionService.clearSelection();
    this.router.navigate(['/dashboard']);
  }

  protected onStartPomodoroSession(): void {
    if (this.taskSelectionService.selectedCount() === 0) {
      return;
    }

    // Placeholder: when the timer/session route exists, redirect to it.
    this.router.navigate(['/dashboard']);
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
