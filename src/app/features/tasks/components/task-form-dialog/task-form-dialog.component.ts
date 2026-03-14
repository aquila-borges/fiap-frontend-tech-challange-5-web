import { ChangeDetectionStrategy, Component, ElementRef, inject, output, signal, viewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { PrimaryButtonComponent, SecondaryButtonComponent } from '../../../../shared';
import { CreateTaskUseCase, UpdateTaskUseCase } from '../../usecases';
import { TaskFormData, Task } from '../../domain';

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
  readonly taskCreated = output<Task>();
  protected readonly titleInputRef = viewChild<ElementRef<HTMLInputElement>>('titleInputRef');
  protected readonly dialogRef = inject(MatDialogRef<TaskFormDialogComponent>);
  protected readonly formBuilder = inject(FormBuilder);
  protected readonly createTaskUseCase = inject(CreateTaskUseCase);
  protected readonly updateTaskUseCase = inject(UpdateTaskUseCase);
  protected readonly taskToEdit = inject<Task | null>(MAT_DIALOG_DATA, { optional: true });
  protected readonly isSubmitting = signal(false);

  protected readonly isEditMode = !!this.taskToEdit;
  protected readonly dialogTitle = this.isEditMode ? 'Editar tarefa' : 'Nova tarefa';

  protected readonly taskForm: FormGroup = this.formBuilder.group({
    title: [this.taskToEdit?.title || '', [Validators.required, Validators.maxLength(40)]],
    description: [this.taskToEdit?.description || '', [Validators.maxLength(100)]],
    dueDate: [this.taskToEdit?.dueDate || null],
    priority: [this.taskToEdit?.priority || 'medium', [Validators.required]],
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

    if (this.isEditMode && this.taskToEdit) {
      this.updateTaskUseCase.execute(this.taskToEdit.id, taskData).subscribe({
        next: (task) => {
          this.isSubmitting.set(false);
          this.dialogRef.close(task);
        },
        error: (error) => {
          console.error('Erro ao atualizar tarefa:', error);
          this.isSubmitting.set(false);
          // TODO: Adicionar feedback de erro para o usuário
        },
      });
    } else {
      this.createTaskUseCase.execute(taskData).subscribe({
        next: (task) => {
          this.isSubmitting.set(false);
          this.taskCreated.emit(task);
          this.resetCreateForm();
        },
        error: (error) => {
          console.error('Erro ao criar tarefa:', error);
          this.isSubmitting.set(false);
          // TODO: Adicionar feedback de erro para o usuário
        },
      });
    }
  }

  protected onCancel(): void {
    this.dialogRef.close();
  }

  private resetCreateForm(): void {
    this.taskForm.reset({
      title: '',
      description: '',
      dueDate: null,
      priority: 'medium',
    });
    this.taskForm.markAsPristine();
    this.taskForm.markAsUntouched();

    // Wait for the form controls to settle, then restore focus for fast consecutive creation.
    queueMicrotask(() => {
      this.titleInputRef()?.nativeElement.focus();
    });
  }
}
