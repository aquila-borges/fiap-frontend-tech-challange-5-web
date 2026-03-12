import { InjectionToken, inject } from '@angular/core';
import { TaskPreferencesService } from '../../domain';
import { TaskPreferencesServiceImpl } from './task-preferences.service';

export const TASK_PREFERENCES_SERVICE_TOKEN = new InjectionToken<TaskPreferencesService>(
  'TASK_PREFERENCES_SERVICE_TOKEN',
  {
    factory: () => inject(TaskPreferencesServiceImpl),
  }
);
