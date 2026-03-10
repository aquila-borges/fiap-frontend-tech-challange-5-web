import { inject, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Task, TaskRepository } from '../domain';
import { TASK_REPOSITORY_TOKEN } from '../index';
import { AuthService } from '../../auth/domain';
import { AUTH_SERVICE_TOKEN } from '../../auth/infrastructure';

@Injectable({
  providedIn: 'root'
})
export class ListTasksUseCase {
  private readonly authService = inject<AuthService>(AUTH_SERVICE_TOKEN);
  private readonly taskRepository = inject<TaskRepository>(TASK_REPOSITORY_TOKEN);

  execute(): Observable<Task[]> {
    const user = this.authService.getCurrentUser();
    if (!user) {
      return throwError(() => new Error('Usuario nao autenticado'));
    }

    return this.taskRepository.getTasksByUserId(user.id);
  }
}
