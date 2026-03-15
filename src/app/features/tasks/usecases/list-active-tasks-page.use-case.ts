import { inject, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { TaskCurrentUserProvider, TaskPageCursor, TaskPageResult, TaskRepository } from '../domain';
import { TASK_CURRENT_USER_PROVIDER_TOKEN, TASK_REPOSITORY_TOKEN } from '../index';

@Injectable({
  providedIn: 'root',
})
export class ListActiveTasksPageUseCase {
  private readonly currentUserProvider = inject<TaskCurrentUserProvider>(TASK_CURRENT_USER_PROVIDER_TOKEN);
  private readonly taskRepository = inject<TaskRepository>(TASK_REPOSITORY_TOKEN);

  execute(pageSize: number, cursor?: TaskPageCursor): Observable<TaskPageResult> {
    const userId = this.currentUserProvider.getCurrentUserId();
    if (!userId) {
      return throwError(() => new Error('Usuário não autenticado'));
    }

    return this.taskRepository.getActiveTasksPageByUserId(userId, pageSize, cursor);
  }
}
