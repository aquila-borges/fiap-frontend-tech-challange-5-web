import { inject, InjectionToken } from '@angular/core';
import { TaskPanelViewPreferencesRepository } from '../domain/index';
import { TaskPanelViewPreferencesLocalStorageRepositoryImpl } from './task-panel-view-preferences-local-storage.repository';

export const TASK_PANEL_VIEW_PREFERENCES_REPOSITORY_TOKEN =
  new InjectionToken<TaskPanelViewPreferencesRepository>(
    'TASK_PANEL_VIEW_PREFERENCES_REPOSITORY_TOKEN',
    {
      factory: () => inject(TaskPanelViewPreferencesLocalStorageRepositoryImpl),
    }
  );
