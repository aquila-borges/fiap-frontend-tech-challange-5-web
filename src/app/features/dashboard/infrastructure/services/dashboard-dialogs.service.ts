import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { TaskConfirmDeleteDialogComponent, TaskFormDialogComponent, Task } from '../../../tasks';
import { DashboardDialogs } from '../../domain';

@Injectable({ providedIn: 'root' })
export class DashboardDialogsService implements DashboardDialogs {
  private readonly dialog = inject(MatDialog);

  openTaskFormDialog(task: Task | Task[]): Observable<Task | Task[] | undefined> {
    return this.dialog
      .open(TaskFormDialogComponent, {
        width: '600px',
        maxWidth: '90vw',
        data: task,
      })
      .afterClosed();
  }

  openDeleteSelectedTasksDialog(): Observable<boolean | undefined> {
    return this.dialog
      .open(TaskConfirmDeleteDialogComponent, {
        width: '500px',
        maxWidth: '90vw',
      })
      .afterClosed();
  }
}
