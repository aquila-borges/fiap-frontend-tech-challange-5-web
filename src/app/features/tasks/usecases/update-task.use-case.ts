import { inject, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Task, TaskFormData, TaskRepository } from '../domain';
import { TASK_REPOSITORY_TOKEN } from '../index';
import { AuthService } from '../../auth/domain';
import { AUTH_SERVICE_TOKEN } from '../../auth';

@Injectable({
  providedIn: 'root'
})
export class UpdateTaskUseCase {
  private readonly authService = inject<AuthService>(AUTH_SERVICE_TOKEN);
  private readonly taskRepository = inject<TaskRepository>(TASK_REPOSITORY_TOKEN);

  execute(taskId: Task['id'], taskData: TaskFormData): Observable<Task> {
    const user = this.authService.getCurrentUser();
    if (!user) {
      return throwError(() => new Error('Usuário não autenticado'));
    }

    const updatedFields: Partial<TaskFormData> = {
      title: taskData.title,
      description: taskData.description,
      priority: taskData.priority,
      dueDate: taskData.dueDate,
    };

    return this.taskRepository.updateTask(taskId, updatedFields, user.id);
  }
}
