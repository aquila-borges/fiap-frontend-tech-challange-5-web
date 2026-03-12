import { InjectionToken, inject } from '@angular/core';
import { TasksLoadingService } from '../../domain';
import { TasksLoadingServiceImpl } from './tasks-loading.service';

export const TASKS_LOADING_SERVICE_TOKEN = new InjectionToken<TasksLoadingService>(
  'TASKS_LOADING_SERVICE_TOKEN',
  {
    factory: () => inject(TasksLoadingServiceImpl),
  }
);
