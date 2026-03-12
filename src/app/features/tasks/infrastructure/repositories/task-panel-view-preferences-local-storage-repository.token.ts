import { inject, InjectionToken } from '@angular/core';
import { TaskPanelViewPreferencesLocalStorageRepository } from '../../domain/index';
import { TaskPanelViewPreferencesLocalStorageRepositoryImpl } from './task-panel-view-preferences-local-storage.repository';

export const TASK_PANEL_VIEW_PREFERENCES_LOCAL_STORAGE_REPOSITORY_TOKEN =
  new InjectionToken<TaskPanelViewPreferencesLocalStorageRepository>(
    'TASK_PANEL_VIEW_PREFERENCES_LOCAL_STORAGE_REPOSITORY_TOKEN',
    {
      factory: () => inject(TaskPanelViewPreferencesLocalStorageRepositoryImpl),
    }
  );
