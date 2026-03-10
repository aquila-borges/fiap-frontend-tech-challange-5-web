import { inject, Injectable } from '@angular/core';
import { forkJoin, Observable, throwError, of } from 'rxjs';
import { Task, TaskRepository } from '../domain';
import { TASK_REPOSITORY_TOKEN } from '../index';
import { AuthService } from '../../auth/domain';
import { AUTH_SERVICE_TOKEN } from '../../auth';

@Injectable({
  providedIn: 'root'
})
export class DeleteTasksUseCase {
  private readonly authService = inject<AuthService>(AUTH_SERVICE_TOKEN);
  private readonly taskRepository = inject<TaskRepository>(TASK_REPOSITORY_TOKEN);

  execute(taskIds: Task['id'][]): Observable<void[]> {
    const user = this.authService.getCurrentUser();
    if (!user) {
      return throwError(() => new Error('Usuário não autenticado'));
    }

    if (taskIds.length === 0) {
      return of([]);
    }

    const deleteObservables = taskIds.map(id => 
      this.taskRepository.deleteTask(id, user.id)
    );

    return forkJoin(deleteObservables);
  }
}
