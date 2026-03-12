import { inject, Injectable } from '@angular/core';
import { forkJoin, Observable, throwError, of } from 'rxjs';
import { Task, TaskCurrentUserProvider, TaskRepository } from '../domain';
import { TASK_CURRENT_USER_PROVIDER_TOKEN, TASK_REPOSITORY_TOKEN } from '../index';

@Injectable({
  providedIn: 'root'
})
export class DeleteTasksUseCase {
  private readonly currentUserProvider = inject<TaskCurrentUserProvider>(TASK_CURRENT_USER_PROVIDER_TOKEN);
  private readonly taskRepository = inject<TaskRepository>(TASK_REPOSITORY_TOKEN);

  execute(taskIds: Task['id'][]): Observable<void[]> {
    const userId = this.currentUserProvider.getCurrentUserId();
    if (!userId) {
      return throwError(() => new Error('Usuário não autenticado'));
    }

    if (taskIds.length === 0) {
      return of([]);
    }

    const deleteObservables = taskIds.map(id => 
      this.taskRepository.deleteTask(id, userId)
    );

    return forkJoin(deleteObservables);
  }
}
