import { ChangeDetectionStrategy, Component, ElementRef, computed, inject, output, signal, viewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { PrimaryButtonComponent, SecondaryButtonComponent } from '../../../../shared';
import { NotificationService } from '../../../../core';
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
  protected readonly taskToEdit = inject<Task | Task[] | null>(MAT_DIALOG_DATA, { optional: true });
  private readonly notificationService = inject(NotificationService);
  protected readonly isSubmitting = signal(false);
  private readonly editQueue = signal<Task[]>([]);
  private readonly updatedEditedTasks = signal<Task[]>([]);
  private readonly createdTasksCount = signal(0);
  protected readonly currentEditIndex = signal(0);

  protected readonly isEditMode = computed(() => this.editQueue().length > 0);
  protected readonly isBatchEditMode = computed(() => this.editQueue().length > 1);
  protected readonly hasNextTaskInBatch = computed(
    () => this.currentEditIndex() < this.editQueue().length - 1
  );
  protected readonly dialogTitle = computed(() => this.isEditMode() ? 'Editar tarefa' : 'Nova tarefa');
  protected readonly submitLabel = computed(() => {
    if (!this.isEditMode()) {
      return 'Criar tarefa';
    }

    if (this.hasNextTaskInBatch()) {
      return 'Concluir e próxima';
    }

    return 'Concluir';
  });
  protected readonly batchProgressLabel = computed(() => {
    if (!this.isBatchEditMode()) {
      return '';
    }

    return `Tarefa ${this.currentEditIndex() + 1} de ${this.editQueue().length}`;
  });

  protected readonly taskForm: FormGroup = this.formBuilder.group({
    title: ['', [Validators.required, Validators.maxLength(40)]],
    description: ['', [Validators.maxLength(100)]],
    dueDate: [null],
    priority: ['medium', [Validators.required]],
  });

  protected readonly priorityOptions = [
    { value: 'low', label: 'Baixa' },
    { value: 'medium', label: 'Média' },
    { value: 'high', label: 'Alta' },
  ];

  constructor() {
    if (Array.isArray(this.taskToEdit)) {
      if (this.taskToEdit.length === 0) {
        return;
      }

      this.editQueue.set(this.taskToEdit);
      this.loadTaskIntoForm(this.taskToEdit[0]);
      return;
    }

    if (this.taskToEdit) {
      this.editQueue.set([this.taskToEdit]);
      this.loadTaskIntoForm(this.taskToEdit);
    }
  }

  protected onSubmit(): void {
    if (this.taskForm.invalid || this.isSubmitting()) {
      return;
    }

    this.isSubmitting.set(true);

    const taskData: TaskFormData = this.taskForm.value;

    if (this.isEditMode()) {
      const currentTask = this.editQueue()[this.currentEditIndex()];
      if (!currentTask) {
        this.isSubmitting.set(false);
        return;
      }

      this.updateTaskUseCase.execute(currentTask.id, taskData).subscribe({
        next: (task) => {
          this.isSubmitting.set(false);

          if (!this.isBatchEditMode()) {
            this.notificationService.success('Tarefa atualizada com sucesso.');
            this.dialogRef.close(task);
            return;
          }

          this.updatedEditedTasks.update(current => [...current, task]);

          if (this.hasNextTaskInBatch()) {
            const nextIndex = this.currentEditIndex() + 1;
            const nextTask = this.editQueue()[nextIndex];

            this.currentEditIndex.set(nextIndex);

            if (nextTask) {
              this.loadTaskIntoForm(nextTask);
            }

            return;
          }

          this.dialogRef.close(this.updatedEditedTasks());
          this.notificationService.success(`${this.updatedEditedTasks().length} tarefas atualizadas com sucesso.`);
        },
        error: () => {
          this.notificationService.error('Erro ao atualizar tarefa. Tente novamente.');
          this.isSubmitting.set(false);
          this.dialogRef.close();
        },
      });
    } else {
      this.createTaskUseCase.execute(taskData).subscribe({
        next: (task) => {
          this.isSubmitting.set(false);
          this.createdTasksCount.update(count => count + 1);
          this.taskCreated.emit(task);
          this.resetCreateForm();
        },
        error: () => {
          this.notificationService.error('Erro ao criar tarefa. Tente novamente.');
          this.isSubmitting.set(false);
          this.dialogRef.close();
        },
      });
    }
  }

  protected onCancel(): void {
    if (this.isBatchEditMode() && this.updatedEditedTasks().length > 0) {
      const updatedCount = this.updatedEditedTasks().length;
      this.notificationService.success(`${updatedCount} tarefa(s) atualizadas antes do fechamento.`);
      this.dialogRef.close(this.updatedEditedTasks());
      return;
    }

    const created = this.createdTasksCount();
    if (created > 0) {
      this.notificationService.success(
        created === 1 ? 'Tarefa criada com sucesso.' : `${created} tarefas criadas com sucesso.`
      );
    }

    this.dialogRef.close();
  }

  private loadTaskIntoForm(task: Task): void {
    this.taskForm.reset({
      title: task.title,
      description: task.description || '',
      dueDate: task.dueDate || null,
      priority: task.priority,
    });
    this.taskForm.markAsPristine();
    this.taskForm.markAsUntouched();

    queueMicrotask(() => {
      this.titleInputRef()?.nativeElement.focus();
    });
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
