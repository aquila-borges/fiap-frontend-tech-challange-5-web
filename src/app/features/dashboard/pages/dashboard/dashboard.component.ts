import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { AddTaskFloatingButtonComponent } from '../../index';
import { ConfirmDeleteDialogComponent, DeleteTasksUseCase, ListTasksUseCase, Task, TaskCardsPanelComponent } from '../../../tasks';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  imports: [AddTaskFloatingButtonComponent, TaskCardsPanelComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {
  protected readonly tasks = signal<Task[]>([]);
  protected readonly isLoadingTasks = signal(true);
  protected readonly isDeletingTasks = signal(false);

  private readonly listTasksUseCase = inject(ListTasksUseCase);
  private readonly deleteTasksUseCase = inject(DeleteTasksUseCase);
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    this.loadTasks();
  }

  protected onTaskCreated(task: Task): void {
    // Adiciona a nova tarefa ao signal local sem recarregar tudo
    this.tasks.update(currentTasks => [task, ...currentTasks]);
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
