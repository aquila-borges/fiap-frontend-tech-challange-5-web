import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  AddTaskFloatingButtonComponent,
  ClearSelectionFloatingButtonComponent,
  DashboardDialogs,
  DASHBOARD_DIALOGS_TOKEN,
  DeleteSelectedFloatingButtonComponent,
  EditSelectedFloatingButtonComponent,
  ExitPomodoroModeFloatingButtonComponent,
  StartPomodoroSessionFloatingButtonComponent,
} from '../../index';
import { PomodoroPanelComponent } from '../../../pomodoro/components/pomodoro-panel/pomodoro-panel.component';
import {
  DeleteTasksUseCase,
  ListTasksUseCase,
  Task,
  TaskPanelComponent,
  TaskSelectionService,
  TasksLoadingService,
  TASK_SELECTION_SERVICE_TOKEN,
  TASKS_LOADING_SERVICE_TOKEN,
} from '../../../tasks';

const POMODORO_PANEL_CLOSE_DURATION_MS = 220;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  imports: [
    MatTooltipModule,
    AddTaskFloatingButtonComponent,
    ClearSelectionFloatingButtonComponent,
    DeleteSelectedFloatingButtonComponent,
    EditSelectedFloatingButtonComponent,
    ExitPomodoroModeFloatingButtonComponent,
    StartPomodoroSessionFloatingButtonComponent,
    PomodoroPanelComponent,
    TaskPanelComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  private readonly listTasksUseCase = inject(ListTasksUseCase);
  private readonly deleteTasksUseCase = inject(DeleteTasksUseCase);
  private readonly dashboardDialogs = inject<DashboardDialogs>(DASHBOARD_DIALOGS_TOKEN);
  private readonly tasksLoadingService = inject<TasksLoadingService>(TASKS_LOADING_SERVICE_TOKEN);
  private readonly taskSelectionService = inject<TaskSelectionService>(TASK_SELECTION_SERVICE_TOKEN);
  private readonly destroyRef = inject(DestroyRef);
  
  protected readonly tasks = signal<Task[]>([]);
  protected readonly isPomodoroPanelRendered = signal(false);
  protected readonly isPomodoroPanelVisible = signal(false);
  protected readonly isPomodoroTaskSelectMode = signal(false);
  protected readonly clearTaskSelectionTrigger = signal(0);
  protected readonly editSelectedTaskTrigger = signal(0);
  protected readonly deleteSelectedTasksTrigger = signal(0);

  protected readonly isLoadingTasks = this.tasksLoadingService.isLoadingTasks;
  protected readonly isDeletingTasks = this.tasksLoadingService.isDeletingTasks;

  private pomodoroPanelCloseTimeoutId: number | null = null;

  constructor() {
    this.loadTasks();
    this.destroyRef.onDestroy(() => {
      if (this.pomodoroPanelCloseTimeoutId !== null) {
        clearTimeout(this.pomodoroPanelCloseTimeoutId);
      }
    });
  }

  protected onTaskCreated(task: Task): void {
    // Adiciona a nova tarefa ao signal local sem recarregar tudo
    this.tasks.update(currentTasks => [task, ...currentTasks]);
  }

  protected onTaskEdit(task: Task): void {
    this.dashboardDialogs.openTaskFormDialog(task).subscribe({
      next: (result: Task | undefined) => {
        if (result) {
          // Atualiza a tarefa editada no signal local
          this.tasks.update(currentTasks =>
            currentTasks.map(t => (t.id === result.id ? result : t))
          );
          this.requestTaskSelectionClear();
        }
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
          this.tasksLoadingService.setDeletingTasks(true);
          this.deleteTasksUseCase
            .execute(taskIds)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
              next: () => {
                // Remove as tarefas deletadas do signal local
                this.tasks.update(currentTasks => 
                  currentTasks.filter(task => !taskIds.includes(task.id))
                );
                this.requestTaskSelectionClear();
                this.tasksLoadingService.setDeletingTasks(false);
              },
              error: (error) => {
                console.error('Erro ao deletar tarefas:', error);
                this.tasksLoadingService.setDeletingTasks(false);
                // Opcional: mostrar notificação de erro para o usuário
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

  protected onTogglePomodoroPanel(): void {
    if (this.isPomodoroPanelVisible()) {
      this.closePomodoroPanel();
      return;
    }

    this.openPomodoroPanel();
  }

  protected onClosePomodoroPanel(): void {
    this.closePomodoroPanel();
  }

  protected onStartPomodoroTaskSelect(): void {
    this.closePomodoroPanel();
    this.requestTaskSelectionClear();
    this.isPomodoroTaskSelectMode.set(true);
  }

  protected onExitPomodoroMode(): void {
    this.isPomodoroTaskSelectMode.set(false);
    this.requestTaskSelectionClear();
    this.openPomodoroPanel();
  }

  private requestTaskSelectionClear(): void {
    this.clearTaskSelectionTrigger.update(value => value + 1);
  }

  private openPomodoroPanel(): void {
    if (this.pomodoroPanelCloseTimeoutId !== null) {
      clearTimeout(this.pomodoroPanelCloseTimeoutId);
      this.pomodoroPanelCloseTimeoutId = null;
    }

    this.isPomodoroPanelRendered.set(true);

    window.setTimeout(() => {
      this.isPomodoroPanelVisible.set(true);
    });
  }

  private closePomodoroPanel(): void {
    this.isPomodoroPanelVisible.set(false);

    if (this.pomodoroPanelCloseTimeoutId !== null) {
      clearTimeout(this.pomodoroPanelCloseTimeoutId);
    }

    this.pomodoroPanelCloseTimeoutId = window.setTimeout(() => {
      this.isPomodoroPanelRendered.set(false);
      this.pomodoroPanelCloseTimeoutId = null;
    }, POMODORO_PANEL_CLOSE_DURATION_MS);
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
        }
      });
  }
}
