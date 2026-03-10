import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { TaskFormDialogComponent } from '../../../tasks';

@Component({
  selector: 'app-add-task-floating-button',
  templateUrl: './add-task-floating-button.component.html',
  styleUrl: './add-task-floating-button.component.scss',
  imports: [MatIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddTaskFloatingButtonComponent {
  protected readonly taskCreated = output<void>();
  protected readonly dialog = inject(MatDialog);

  protected onAddTask(): void {
    this.dialog.open(TaskFormDialogComponent, {
      width: '600px',
      maxWidth: '90vw',
    }).afterClosed().subscribe({
      next: result => {
        if (result) {
          this.taskCreated.emit();
        }
      },
      error: error => {
        console.error('Erro ao abrir dialog:', error);
      }
    });
  }
}
