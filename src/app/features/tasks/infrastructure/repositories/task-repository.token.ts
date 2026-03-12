import { inject, InjectionToken } from '@angular/core';
import { TaskRepository } from '../../domain/index';
import { TaskFirestoreRepositoryImpl } from './task.repository';

export const TASK_REPOSITORY_TOKEN = new InjectionToken<TaskRepository>(
  'TASK_REPOSITORY_TOKEN',
  {
    factory: () => inject(TaskFirestoreRepositoryImpl),
  }
);