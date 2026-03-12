import { inject, InjectionToken } from '@angular/core';
import { DashboardDialogs } from '../../domain';
import { DashboardDialogsService } from './dashboard-dialogs.service';

export const DASHBOARD_DIALOGS_TOKEN = new InjectionToken<DashboardDialogs>(
  'DASHBOARD_DIALOGS_TOKEN',
  {
    factory: () => inject(DashboardDialogsService),
  }
);
