import { inject, InjectionToken } from '@angular/core';
import { TaskService } from '../../domain';
import { TaskServiceImpl } from './task.service';

export const TASK_SERVICE_TOKEN = new InjectionToken<TaskService>(
  'TASK_SERVICE_TOKEN',
  {
    factory: () => inject(TaskServiceImpl),
  }
);
