import { inject, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Task, TaskFormData, TaskRepository } from '../domain';
import { TASK_REPOSITORY_TOKEN } from '../index';
import { AuthService } from '../../auth/domain';
import { AUTH_SERVICE_TOKEN } from '../../auth/infrastructure';

@Injectable({
  providedIn: 'root'
})
export class CreateTaskUseCase {
  private readonly authService = inject<AuthService>(AUTH_SERVICE_TOKEN);
  private readonly taskRepository = inject<TaskRepository>(TASK_REPOSITORY_TOKEN);

  private readonly pastelColors = [
    '#fff6ac',
    '#ffdfe9',
    '#dff4ff',
    '#e7f8df',
    '#f5e6ff',
    '#ffe4d6',
  ];

  private getRandomColor(): string {
    return this.pastelColors[Math.floor(Math.random() * this.pastelColors.length)];
  }

  execute(taskData: TaskFormData): Observable<Task> {
    const user = this.authService.getCurrentUser();
    if (!user) {
      return throwError(() => new Error('Usuario nao autenticado'));
    }

    const now = new Date();
    const task: Omit<Task, 'id'> = {
      title: taskData.title,
      description: taskData.description,
      priority: taskData.priority,
      dueDate: taskData.dueDate,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
      userId: user.id,
      color: this.getRandomColor(),
    };

    return this.taskRepository.createTask(task);
  }
}
