import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, map } from 'rxjs';
import { TaskDialogService, TaskDialogResult } from '../../domain';
import { TaskFormDialogComponent } from '../../components';

@Injectable({
  providedIn: 'root'
})
export class TaskDialogServiceImpl implements TaskDialogService {
  private readonly dialog = inject(MatDialog);

  openCreateTaskDialog(): Observable<TaskDialogResult> {
    const dialogRef = this.dialog.open(TaskFormDialogComponent, {
      width: '600px',
      maxWidth: '90vw',
    });

    return dialogRef.afterClosed().pipe(
      map(result => ({
        task: result,
        cancelled: !result
      }))
    );
  }
}
