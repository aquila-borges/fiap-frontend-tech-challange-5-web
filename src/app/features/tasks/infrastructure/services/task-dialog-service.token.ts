import { inject, InjectionToken } from '@angular/core';
import { TaskDialogService } from '../../domain';
import { TaskDialogServiceImpl } from './task-dialog.service';

export const TASK_DIALOG_SERVICE_TOKEN = new InjectionToken<TaskDialogService>(
  'TASK_DIALOG_SERVICE_TOKEN',
  {
    factory: () => inject(TaskDialogServiceImpl),
  }
);
