import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import {
  FocusDialogButtonDirective,
  PrimaryButtonComponent,
  SecondaryButtonComponent,
} from '../../../../shared';

@Component({
  selector: 'app-pomodoro-exit-confirmation-modal',
  templateUrl: './pomodoro-exit-confirmation-modal.component.html',
  styleUrl: './pomodoro-exit-confirmation-modal.component.scss',
  imports: [PrimaryButtonComponent, SecondaryButtonComponent, FocusDialogButtonDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PomodoroExitConfirmationModalComponent {
  protected readonly dialogRef = inject(MatDialogRef<PomodoroExitConfirmationModalComponent>);

  protected readonly title = 'Confirmar saída';
  protected readonly description = 'Ao sair, a seleção das tarefas será limpa e você retornará para a página inicial.';
  protected readonly confirmLabel = 'Sair do modo Pomodoro';
  protected readonly cancelLabel = 'Continuar sessão';

  protected onCancel(): void {
    this.dialogRef.close(false);
  }

  protected onConfirm(): void {
    this.dialogRef.close(true);
  }
}
