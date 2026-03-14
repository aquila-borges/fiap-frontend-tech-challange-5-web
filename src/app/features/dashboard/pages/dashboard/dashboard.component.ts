import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
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
  ListActiveTasksUseCase,
  Task,
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
  private readonly listTasksUseCase = inject(ListActiveTasksUseCase);
  private readonly deleteTasksUseCase = inject(DeleteTasksUseCase);
  private readonly dashboardDialogs = inject<DashboardDialogs>(DASHBOARD_DIALOGS_TOKEN);
  private readonly tasksLoadingService = inject<TasksLoadingService>(TASKS_LOADING_SERVICE_TOKEN);
  private readonly taskSelectionService = inject<TaskSelectionService>(TASK_SELECTION_SERVICE_TOKEN);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  
  protected readonly tasks = signal<Task[]>([]);
  protected readonly clearTaskSelectionTrigger = signal(0);
  protected readonly editSelectedTaskTrigger = signal(0);
  protected readonly deleteSelectedTasksTrigger = signal(0);

  protected readonly isLoadingTasks = this.tasksLoadingService.isLoadingTasks;

  constructor() {
    this.taskSelectionService.clearSelection();
    this.loadTasks();
  }

  protected onTaskCreated(task: Task): void {
    // Adiciona a nova tarefa ao signal local sem recarregar tudo
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
                // Remove as tarefas deletadas do signal local
                this.tasks.update(currentTasks => 
                  currentTasks.filter(task => !taskIds.includes(task.id))
                );
                this.requestTaskSelectionClear();
              },
              error: (error) => {
                console.error('Erro ao deletar tarefas:', error);
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
