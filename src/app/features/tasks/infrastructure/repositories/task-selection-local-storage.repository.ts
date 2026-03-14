import { Injectable } from '@angular/core';
import { Task } from '../../domain';
import { TaskSelectionLocalStorageRepository } from '../../domain';
import { TASK_SELECTION_STORAGE_KEY } from '../constants/task-selection-storage-key.const';

@Injectable({
  providedIn: 'root',
})
export class TaskSelectionLocalStorageRepositoryImpl implements TaskSelectionLocalStorageRepository {
  load(): Task['id'][] {
    if (!this.canUseStorage()) {
      return [];
    }

    try {
      const serializedIds = localStorage.getItem(TASK_SELECTION_STORAGE_KEY);
      if (!serializedIds) {
        return [];
      }

      const parsed = JSON.parse(serializedIds);
      if (!Array.isArray(parsed)) {
        localStorage.removeItem(TASK_SELECTION_STORAGE_KEY);
        return [];
      }

      return parsed.filter((id): id is Task['id'] => typeof id === 'string' && id.length > 0);
    } catch {
      localStorage.removeItem(TASK_SELECTION_STORAGE_KEY);
      return [];
    }
  }

  save(taskIds: Task['id'][]): void {
    if (!this.canUseStorage()) {
      return;
    }

    if (taskIds.length === 0) {
      localStorage.removeItem(TASK_SELECTION_STORAGE_KEY);
      return;
    }

    localStorage.setItem(TASK_SELECTION_STORAGE_KEY, JSON.stringify(taskIds));
  }

  private canUseStorage(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }
}
