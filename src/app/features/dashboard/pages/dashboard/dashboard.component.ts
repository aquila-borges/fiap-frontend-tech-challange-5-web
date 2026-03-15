import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, effect, inject, signal, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import {
  AddTaskFloatingButtonComponent,
  ClearSelectionFloatingButtonComponent,
  DashboardDialogs,
  DASHBOARD_DIALOGS_TOKEN,
  DeleteSelectedFloatingButtonComponent,
  EditSelectedFloatingButtonComponent,
  PomodoroFloatingButtonComponent,
} from '../../index';
import {
  DeleteTasksUseCase,
  ListActiveTasksPageUseCase,
  Task,
  TaskPageCursor,
  TaskPanelComponent,
  TaskSelectionService,
  TasksLoadingService,
  TASK_SELECTION_SERVICE_TOKEN,
  TASKS_LOADING_SERVICE_TOKEN,
} from '../../../tasks';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  imports: [
    AddTaskFloatingButtonComponent,
    ClearSelectionFloatingButtonComponent,
    DeleteSelectedFloatingButtonComponent,
    EditSelectedFloatingButtonComponent,
    PomodoroFloatingButtonComponent,
    TaskPanelComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  private static readonly PAGE_SIZE = 20;

  private readonly listTasksPageUseCase = inject(ListActiveTasksPageUseCase);
  private readonly deleteTasksUseCase = inject(DeleteTasksUseCase);
  private readonly dashboardDialogs = inject<DashboardDialogs>(DASHBOARD_DIALOGS_TOKEN);
  private readonly tasksLoadingService = inject<TasksLoadingService>(TASKS_LOADING_SERVICE_TOKEN);
  private readonly taskSelectionService = inject<TaskSelectionService>(TASK_SELECTION_SERVICE_TOKEN);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private infiniteScrollObserver: IntersectionObserver | null = null;
  protected readonly infiniteScrollSentinelRef = viewChild<ElementRef<HTMLElement>>('infiniteScrollSentinel');
  
  protected readonly tasks = signal<Task[]>([]);
  protected readonly clearTaskSelectionTrigger = signal(0);
  protected readonly editSelectedTaskTrigger = signal(0);
  protected readonly deleteSelectedTasksTrigger = signal(0);
  protected readonly nextTasksCursor = signal<TaskPageCursor | null>(null);
  protected readonly hasMoreTasks = signal(true);
  protected readonly isLoadingMoreTasks = signal(false);

  protected readonly isLoadingTasks = this.tasksLoadingService.isLoadingTasks;

  constructor() {
    this.taskSelectionService.clearSelection();
    this.loadFirstTasksPage();

    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      effect(() => {
        const sentinelElement = this.infiniteScrollSentinelRef()?.nativeElement;
        if (!sentinelElement || this.infiniteScrollObserver) {
          return;
        }

        this.infiniteScrollObserver = new IntersectionObserver(entries => {
          const [entry] = entries;
          if (entry?.isIntersecting) {
            this.loadNextTasksPage();
          }
        }, {
          rootMargin: '240px 0px',
          threshold: 0,
        });

        this.infiniteScrollObserver.observe(sentinelElement);
      });

      this.destroyRef.onDestroy(() => {
        this.infiniteScrollObserver?.disconnect();
        this.infiniteScrollObserver = null;
      });
    }
  }

  protected onTaskCreated(task: Task): void {
    this.tasks.update(currentTasks => [task, ...currentTasks]);
  }

  protected onTaskEdit(task: Task | Task[]): void {
    this.dashboardDialogs.openTaskFormDialog(task).subscribe({
      next: (result: Task | Task[] | undefined) => {
        if (!result) {
          return;
        }

        const updatedTasks = Array.isArray(result) ? result : [result];
        const updatesById = new Map(updatedTasks.map(updatedTask => [updatedTask.id, updatedTask]));

        this.tasks.update(currentTasks =>
          currentTasks.map(currentTask => updatesById.get(currentTask.id) ?? currentTask)
        );

        this.requestTaskSelectionClear();
      },
      error: (error: unknown) => {
        console.error('Erro ao editar tarefa:', error);
      }
    });
  }

  protected onTasksDeleted(taskIds: Task['id'][]): void {
    this.dashboardDialogs.openDeleteSelectedTasksDialog().subscribe({
      next: (confirmed: boolean | undefined) => {
        if (confirmed) {
          this.deleteTasksUseCase
            .execute(taskIds)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
              next: () => {
                this.tasks.update(currentTasks => 
                  currentTasks.filter(task => !taskIds.includes(task.id))
                );
                this.requestTaskSelectionClear();
              },
              error: (error) => {
                console.error('Erro ao deletar tarefas:', error);
              }
            });
        }
      },
      error: (error) => {
        console.error('Erro ao abrir modal de confirmação:', error);
      }
    });
  }

  protected onClearSelectedTasksRequested(): void {
    this.requestTaskSelectionClear();
  }

  protected onEditSelectedTaskRequested(): void {
    this.editSelectedTaskTrigger.update(value => value + 1);
  }

  protected onDeleteSelectedTasksRequested(): void {
    this.deleteSelectedTasksTrigger.update(value => value + 1);
  }

  protected onOpenPomodoroIntro(): void {
    if (!this.taskSelectionService.hasSelected()) {
      this.taskSelectionService.clearSelection();
      this.router.navigate(['/pomodoro']);
      return;
    }

    this.dashboardDialogs.openPomodoroSelectedTasksDialog().subscribe({
      next: (confirmed: boolean | undefined) => {
        if (confirmed) {
          this.router.navigate(['/pomodoro/mode']);
        }
      },
      error: (error: unknown) => {
        console.error('Erro ao abrir modal de confirmação do Pomodoro:', error);
      },
    });
  }

  private requestTaskSelectionClear(): void {
    this.clearTaskSelectionTrigger.update(value => value + 1);
  }

  private loadFirstTasksPage(): void {
    this.tasksLoadingService.setLoadingTasks(true);
    this.hasMoreTasks.set(true);
    this.nextTasksCursor.set(null);

    this.listTasksPageUseCase
      .execute(DashboardComponent.PAGE_SIZE)
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
        }
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
      .execute(DashboardComponent.PAGE_SIZE, cursor)
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
        },
      });
  }
}
