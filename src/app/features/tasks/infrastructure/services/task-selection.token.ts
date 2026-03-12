import { InjectionToken, inject } from '@angular/core';
import { TaskSelectionService } from '../../domain';
import { TaskSelectionServiceImpl } from './task-selection.service';

export const TASK_SELECTION_SERVICE_TOKEN = new InjectionToken<TaskSelectionService>(
  'TASK_SELECTION_SERVICE_TOKEN',
  {
    factory: () => inject(TaskSelectionServiceImpl),
  }
);
