import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Task, TaskFormDialogComponent } from '../../../tasks';
import { fabFadeAnimation, FloatingActionButtonComponent } from '../../../../shared';

@Component({
  selector: 'app-add-task-floating-button',
  templateUrl: './add-task-floating-button.component.html',
  imports: [FloatingActionButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fabFadeAnimation],
  host: { '[@fabFade]': '' },
})
export class AddTaskFloatingButtonComponent {
  protected readonly taskCreated = output<Task>();
  protected readonly dialog = inject(MatDialog);

  protected onAddTask(): void {
    this.dialog.open(TaskFormDialogComponent, {
      width: '600px',
      maxWidth: '90vw',
    }).afterClosed().subscribe({
      next: result => {
        if (result) {
          this.taskCreated.emit(result);
        }
      },
      error: error => {
        console.error('Erro ao abrir dialog:', error);
      }
    });
  }
}
