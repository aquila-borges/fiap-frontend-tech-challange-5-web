import { inject, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Task, TaskCurrentUserProvider, TaskFormData, TaskRepository } from '../domain';
import { TASK_CURRENT_USER_PROVIDER_TOKEN, TASK_REPOSITORY_TOKEN } from '../index';

@Injectable({
  providedIn: 'root'
})
export class CreateTaskUseCase {
  private readonly currentUserProvider = inject<TaskCurrentUserProvider>(TASK_CURRENT_USER_PROVIDER_TOKEN);
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
    const userId = this.currentUserProvider.getCurrentUserId();
    if (!userId) {
      return throwError(() => new Error('Usuário não autenticado'));
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
      userId,
      color: this.getRandomColor(),
    };

    return this.taskRepository.createTask(task);
  }
}
