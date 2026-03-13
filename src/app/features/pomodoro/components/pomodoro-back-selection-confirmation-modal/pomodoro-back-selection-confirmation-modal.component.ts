import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { PrimaryButtonComponent, SecondaryButtonComponent } from '../../../../shared';

@Component({
  selector: 'app-pomodoro-back-selection-confirmation-modal',
  templateUrl: './pomodoro-back-selection-confirmation-modal.component.html',
  styleUrl: './pomodoro-back-selection-confirmation-modal.component.scss',
  imports: [PrimaryButtonComponent, SecondaryButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PomodoroBackSelectionConfirmationModalComponent {
  protected readonly dialogRef = inject(MatDialogRef<PomodoroBackSelectionConfirmationModalComponent>);

  protected readonly title = 'Voltar para seleção de tarefas?';
  protected readonly description =
    'Você já iniciou o cronômetro. Tem certeza de que deseja voltar para a tela de seleção de tarefas?';
  protected readonly confirmLabel = 'Voltar para seleção';
  protected readonly cancelLabel = 'Continuar sessão';

  protected onCancel(): void {
    this.dialogRef.close(false);
  }

  protected onConfirm(): void {
    this.dialogRef.close(true);
  }
}
