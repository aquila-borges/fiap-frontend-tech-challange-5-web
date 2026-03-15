import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from '../../../../core';
import { InfiniteScrollSentinelDirective } from '../../../../shared/directives/infinite-scroll-sentinel.directive';
import {
  ListActiveTasksPageUseCase,
  Task,
  TaskPageCursor,
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
    InfiniteScrollSentinelDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PomodoroTaskComponent {
  private static readonly PAGE_SIZE = 20;

  private readonly listTasksPageUseCase = inject(ListActiveTasksPageUseCase);
  private readonly tasksLoadingService = inject<TasksLoadingService>(TASKS_LOADING_SERVICE_TOKEN);
  private readonly taskSelectionService = inject<TaskSelectionService>(TASK_SELECTION_SERVICE_TOKEN);
  private readonly calculateEstimateUseCase = inject(CalculatePomodoroSessionEstimateUseCase);
  private readonly pomodoroFlowService = inject(PomodoroFlowService);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly notificationService = inject(NotificationService);

  protected readonly tasks = signal<Task[]>([]);
  protected readonly nextTasksCursor = signal<TaskPageCursor | null>(null);
  protected readonly hasMoreTasks = signal(true);
  protected readonly isLoadingMoreTasks = signal(false);
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
    this.loadFirstTasksPage();
    this.pomodoroFlowService.markSessionVisited();

    this.destroyRef.onDestroy(() => undefined);
  }

  protected onInfiniteScrollSentinelReached(): void {
    this.loadNextTasksPage();
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

  private loadFirstTasksPage(): void {
    this.tasksLoadingService.setLoadingTasks(true);
    this.hasMoreTasks.set(true);
    this.nextTasksCursor.set(null);

    this.listTasksPageUseCase
      .execute(PomodoroTaskComponent.PAGE_SIZE)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: page => {
          this.tasks.set(page.tasks);
          this.nextTasksCursor.set(page.nextCursor);
          this.hasMoreTasks.set(page.hasMore);
          this.tasksLoadingService.setLoadingTasks(false);
        },
        error: () => {
          this.tasks.set([]);
          this.nextTasksCursor.set(null);
          this.hasMoreTasks.set(false);
          this.tasksLoadingService.setLoadingTasks(false);
          this.notificationService.error('Erro ao carregar tarefas. Tente novamente.');
        },
      });
  }

  private loadNextTasksPage(): void {
    if (!this.hasMoreTasks() || this.isLoadingTasks() || this.isLoadingMoreTasks()) {
      return;
    }

    const cursor = this.nextTasksCursor();
    if (!cursor) {
      return;
    }

    this.isLoadingMoreTasks.set(true);
    this.listTasksPageUseCase
      .execute(PomodoroTaskComponent.PAGE_SIZE, cursor)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: page => {
          this.tasks.update(currentTasks => {
            const existingIds = new Set(currentTasks.map(task => task.id));
            const newTasks = page.tasks.filter(task => !existingIds.has(task.id));
            return [...currentTasks, ...newTasks];
          });

          this.nextTasksCursor.set(page.nextCursor);
          this.hasMoreTasks.set(page.hasMore);
          this.isLoadingMoreTasks.set(false);
        },
        error: () => {
          this.isLoadingMoreTasks.set(false);
          this.notificationService.error('Erro ao carregar mais tarefas. Tente novamente.');
        },
      });
  }
}
