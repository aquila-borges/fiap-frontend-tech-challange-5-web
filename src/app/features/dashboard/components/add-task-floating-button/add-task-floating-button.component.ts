import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { Task, TaskFormDialogComponent } from '../../../tasks';
import { fabFadeAnimation } from '../../../../shared';

@Component({
  selector: 'app-add-task-floating-button',
  templateUrl: './add-task-floating-button.component.html',
  styleUrl: './add-task-floating-button.component.scss',
  imports: [MatIcon, MatTooltipModule],
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
