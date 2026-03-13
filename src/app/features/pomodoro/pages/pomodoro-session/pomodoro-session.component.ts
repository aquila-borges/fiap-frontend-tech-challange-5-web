import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  ListTasksUseCase,
  Task,
  TaskPanelComponent,
  TaskSelectionService,
  TasksLoadingService,
  TASK_SELECTION_SERVICE_TOKEN,
  TASKS_LOADING_SERVICE_TOKEN,
} from '../../../tasks';
import { POMODORO_DEFAULTS } from '../../domain';
import { PomodoroExitFloatingButtonComponent } from '../../index';

@Component({
  selector: 'app-pomodoro-session',
  templateUrl: './pomodoro-session.component.html',
  styleUrl: './pomodoro-session.component.scss',
  imports: [
    MatIconModule,
    MatTooltipModule,
    PomodoroExitFloatingButtonComponent,
    TaskPanelComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PomodoroSessionComponent {
  protected readonly maxTaskCards = POMODORO_DEFAULTS.maxTaskCards;

  private readonly listTasksUseCase = inject(ListTasksUseCase);
  private readonly tasksLoadingService = inject<TasksLoadingService>(TASKS_LOADING_SERVICE_TOKEN);
  private readonly taskSelectionService = inject<TaskSelectionService>(TASK_SELECTION_SERVICE_TOKEN);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly tasks = signal<Task[]>([]);
  protected readonly isLoadingTasks = this.tasksLoadingService.isLoadingTasks;
  protected readonly isStartDisabled = computed(
    () => this.taskSelectionService.selectedCount() === 0
  );

  constructor() {
    this.taskSelectionService.clearSelection();
    this.loadTasks();

    this.destroyRef.onDestroy(() => undefined);
  }

  protected onExitPomodoroMode(): void {
    this.taskSelectionService.clearSelection();
    this.router.navigate(['/pomodoro/setup']);
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
