import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { PrimaryButtonComponent, SecondaryButtonComponent } from '../../../../shared';

@Component({
  selector: 'app-pomodoro-session-back-to-intro-confirmation-modal',
  templateUrl: './pomodoro-session-back-to-intro-confirmation-modal.component.html',
  styleUrl: './pomodoro-session-back-to-intro-confirmation-modal.component.scss',
  imports: [PrimaryButtonComponent, SecondaryButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PomodoroSessionBackToIntroConfirmationModalComponent {
  protected readonly dialogRef = inject(MatDialogRef<PomodoroSessionBackToIntroConfirmationModalComponent>);

  protected readonly title = 'Voltar para o setup do Pomodoro?';
  protected readonly description =
    'Você possui tarefas selecionadas. Ao voltar para o setup, as seleções atuais serão desmarcadas. Deseja continuar?';
  protected readonly confirmLabel = 'Voltar para o início';
  protected readonly cancelLabel = 'Continuar seleção';

  protected onCancel(): void {
    this.dialogRef.close(false);
  }

  protected onConfirm(): void {
    this.dialogRef.close(true);
  }
}
