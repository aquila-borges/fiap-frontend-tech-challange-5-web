import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { TaskDialogService, TASK_DIALOG_SERVICE_TOKEN } from '../../../tasks';

@Component({
  selector: 'app-add-task-floating-button',
  templateUrl: './add-task-floating-button.component.html',
  styleUrl: './add-task-floating-button.component.scss',
  imports: [MatIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddTaskFloatingButtonComponent {
  protected readonly taskDialogService = inject<TaskDialogService>(TASK_DIALOG_SERVICE_TOKEN);

  protected onAddTask(): void {
    this.taskDialogService.openCreateTaskDialog().subscribe({
      next: (result) => {
        if (!result.cancelled && result.task) {
          console.log('Tarefa criada com sucesso:', result.task);
          // TODO: Implementar feedback visual ou atualizar lista
        }
      },
      error: (error) => {
        console.error('Erro ao abrir dialog:', error);
      }
    });
  }
}
