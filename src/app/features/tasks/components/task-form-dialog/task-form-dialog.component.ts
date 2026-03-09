import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { PrimaryButtonComponent, SecondaryButtonComponent } from '../../../../shared';
import { CreateTaskUseCase } from '../../usecases';
import { TaskFormData } from '../../domain';

@Component({
  selector: 'app-task-form-dialog',
  templateUrl: './task-form-dialog.component.html',
  styleUrl: './task-form-dialog.component.scss',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    PrimaryButtonComponent,
    SecondaryButtonComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskFormDialogComponent {
  protected readonly dialogRef = inject(MatDialogRef<TaskFormDialogComponent>);
  protected readonly formBuilder = inject(FormBuilder);
  protected readonly createTaskUseCase = inject(CreateTaskUseCase);
  protected readonly isSubmitting = signal(false);

  protected readonly taskForm: FormGroup = this.formBuilder.group({
    title: ['', [Validators.required, Validators.maxLength(100)]],
    description: ['', [Validators.maxLength(500)]],
    dueDate: [null],
    priority: ['medium', [Validators.required]],
  });

  protected readonly priorityOptions = [
    { value: 'low', label: 'Baixa' },
    { value: 'medium', label: 'Média' },
    { value: 'high', label: 'Alta' },
  ];

  protected onSubmit(): void {
    if (this.taskForm.invalid || this.isSubmitting()) {
      return;
    }

    this.isSubmitting.set(true);

    const taskData: TaskFormData = this.taskForm.value;

    this.createTaskUseCase.execute(taskData).subscribe({
      next: (task) => {
        this.isSubmitting.set(false);
        this.dialogRef.close(task);
      },
      error: (error) => {
        console.error('Erro ao criar tarefa:', error);
        this.isSubmitting.set(false);
        // TODO: Adicionar feedback de erro para o usuário
      },
    });
  }

  protected onCancel(): void {
    this.dialogRef.close();
  }
}
