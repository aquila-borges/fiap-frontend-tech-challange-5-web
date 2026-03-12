import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  AddTaskFloatingButtonComponent,
  ClearSelectionFloatingButtonComponent,
  DeleteSelectedFloatingButtonComponent,
  EditSelectedFloatingButtonComponent,
  ExitPomodoroModeFloatingButtonComponent,
  StartPomodoroSessionFloatingButtonComponent,
} from '../../index';
import { PomodoroPanelComponent } from '../../../pomodoro/components/pomodoro-panel/pomodoro-panel.component';
import { ConfirmDeleteDialogComponent, DeleteTasksUseCase, ListTasksUseCase, Task, TaskCardsPanelComponent, TaskFormDialogComponent } from '../../../tasks';

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
    TaskCardsPanelComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  protected readonly tasks = signal<Task[]>([]);
  protected readonly isLoadingTasks = signal(true);
  protected readonly isDeletingTasks = signal(false);
  protected readonly isPomodoroPanelRendered = signal(false);
  protected readonly isPomodoroPanelVisible = signal(false);
  protected readonly isPomodoroTaskSelectMode = signal(false);

  private readonly taskCardsPanel = viewChild.required<TaskCardsPanelComponent>('taskCardsPanel');

  private readonly listTasksUseCase = inject(ListTasksUseCase);
  private readonly deleteTasksUseCase = inject(DeleteTasksUseCase);
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);
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
    const dialogRef = this.dialog.open(TaskFormDialogComponent, {
      width: '600px',
      maxWidth: '90vw',
      data: task,
    });

    dialogRef.afterClosed().subscribe({
      next: result => {
        if (result) {
          // Atualiza a tarefa editada no signal local
          this.tasks.update(currentTasks =>
            currentTasks.map(t => (t.id === result.id ? result : t))
          );
          this.taskCardsPanel().clearSelectedTasks();
        }
      },
      error: (error) => {
        console.error('Erro ao editar tarefa:', error);
      }
    });
  }

  protected onTasksDeleted(taskIds: Task['id'][]): void {
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
      width: '500px',
      maxWidth: '90vw',
    });

    dialogRef.afterClosed().subscribe({
      next: confirmed => {
        if (confirmed) {
          this.isDeletingTasks.set(true);
          this.deleteTasksUseCase
            .execute(taskIds)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
              next: () => {
                // Remove as tarefas deletadas do signal local
                this.tasks.update(currentTasks => 
                  currentTasks.filter(task => !taskIds.includes(task.id))
                );
                this.taskCardsPanel().clearSelectedTasks();
                this.isDeletingTasks.set(false);
              },
              error: (error) => {
                console.error('Erro ao deletar tarefas:', error);
                this.isDeletingTasks.set(false);
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
    this.taskCardsPanel().clearSelectedTasks();
    this.isPomodoroTaskSelectMode.set(true);
  }

  protected onExitPomodoroMode(): void {
    this.isPomodoroTaskSelectMode.set(false);
    this.taskCardsPanel().clearSelectedTasks();
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
    this.isLoadingTasks.set(true);
    this.listTasksUseCase
      .execute()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: tasks => {
          this.tasks.set(tasks);
          this.isLoadingTasks.set(false);
        },
        error: () => {
          this.tasks.set([]);
          this.isLoadingTasks.set(false);
        }
      });
  }
}
