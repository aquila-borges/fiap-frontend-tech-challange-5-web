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
    const dialogRef = this.dialog.open(TaskFormDialogComponent, {
      width: '600px',
      maxWidth: '90vw',
    });

    const taskCreatedSubscription = dialogRef.componentInstance.taskCreated.subscribe(task => {
      this.taskCreated.emit(task);
    });

    dialogRef.afterClosed().subscribe({
      next: () => {
        taskCreatedSubscription.unsubscribe();
      },
      error: () => {
        taskCreatedSubscription.unsubscribe();
      }
    });
  }
}
