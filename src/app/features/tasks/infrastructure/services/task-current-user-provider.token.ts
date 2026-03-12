import { inject, InjectionToken } from '@angular/core';
import { TaskCurrentUserProvider } from '../../domain';
import { TaskCurrentUserProviderServiceImpl } from './task-current-user-provider.service';

export const TASK_CURRENT_USER_PROVIDER_TOKEN = new InjectionToken<TaskCurrentUserProvider>(
  'TASK_CURRENT_USER_PROVIDER_TOKEN',
  {
    factory: () => inject(TaskCurrentUserProviderServiceImpl),
  }
);