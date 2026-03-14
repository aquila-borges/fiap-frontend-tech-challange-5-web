import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { TaskConfirmDeleteDialogComponent, TaskFormDialogComponent, Task } from '../../../tasks';
import {
  DashboardDialogs,
  PomodoroSelectedTasksConfirmationModalComponent,
} from '../../index';

@Injectable({ providedIn: 'root' })
export class DashboardDialogsService implements DashboardDialogs {
  private readonly dialog = inject(MatDialog);

  openTaskFormDialog(task: Task | Task[]): Observable<Task | Task[] | undefined> {
    return this.dialog
      .open(TaskFormDialogComponent, {
        maxWidth: '90vw',
        data: task,
      })
      .afterClosed();
  }

  openDeleteSelectedTasksDialog(): Observable<boolean | undefined> {
    return this.dialog
      .open(TaskConfirmDeleteDialogComponent, {
        maxWidth: '90vw',
      })
      .afterClosed();
  }

  openPomodoroSelectedTasksDialog(): Observable<boolean | undefined> {
    return this.dialog
      .open(PomodoroSelectedTasksConfirmationModalComponent, {
        maxWidth: '90vw',
      })
      .afterClosed();
  }
}
