import { inject, Injectable } from '@angular/core';
import { Task, TaskSelectionLocalStorageRepository } from '../domain';
import { TASK_SELECTION_LOCAL_STORAGE_REPOSITORY_TOKEN } from '../infrastructure';

@Injectable({
  providedIn: 'root',
})
export class LoadLocalStorageTaskSelectionUseCase {
  private readonly repository = inject<TaskSelectionLocalStorageRepository>(
    TASK_SELECTION_LOCAL_STORAGE_REPOSITORY_TOKEN
  );

  execute(): Task['id'][] {
    return this.repository.load();
  }
}
