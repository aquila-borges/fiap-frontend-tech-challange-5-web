import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import {
  FocusDialogButtonDirective,
  PrimaryButtonComponent,
  SecondaryButtonComponent,
} from '../../../../shared';

@Component({
  selector: 'app-task-confirm-delete-dialog',
  templateUrl: './task-confirm-delete-dialog.component.html',
  styleUrl: './task-confirm-delete-dialog.component.scss',
  imports: [PrimaryButtonComponent, SecondaryButtonComponent, FocusDialogButtonDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskConfirmDeleteDialogComponent {
  protected readonly dialogRef = inject(MatDialogRef<TaskConfirmDeleteDialogComponent>);

  protected onConfirm(): void {
    this.dialogRef.close(true);
  }

  protected onCancel(): void {
    this.dialogRef.close(false);
  }
}
