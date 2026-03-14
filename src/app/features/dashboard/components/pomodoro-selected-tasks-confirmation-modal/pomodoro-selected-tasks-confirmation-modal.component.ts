import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { PrimaryButtonComponent, SecondaryButtonComponent } from '../../../../shared';

@Component({
  selector: 'app-pomodoro-selected-tasks-confirmation-modal',
  templateUrl: './pomodoro-selected-tasks-confirmation-modal.component.html',
  styleUrl: './pomodoro-selected-tasks-confirmation-modal.component.scss',
  imports: [PrimaryButtonComponent, SecondaryButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PomodoroSelectedTasksConfirmationModalComponent {
  protected readonly dialogRef = inject(MatDialogRef<PomodoroSelectedTasksConfirmationModalComponent>);

  protected onCancel(): void {
    this.dialogRef.close(false);
  }

  protected onConfirm(): void {
    this.dialogRef.close(true);
  }
}
