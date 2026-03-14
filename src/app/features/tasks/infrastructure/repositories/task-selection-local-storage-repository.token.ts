import { inject, InjectionToken } from '@angular/core';
import { TaskSelectionLocalStorageRepository } from '../../domain';
import { TaskSelectionLocalStorageRepositoryImpl } from './task-selection-local-storage.repository';

export const TASK_SELECTION_LOCAL_STORAGE_REPOSITORY_TOKEN =
  new InjectionToken<TaskSelectionLocalStorageRepository>(
    'TASK_SELECTION_LOCAL_STORAGE_REPOSITORY_TOKEN',
    {
      factory: () => inject(TaskSelectionLocalStorageRepositoryImpl),
    }
  );
