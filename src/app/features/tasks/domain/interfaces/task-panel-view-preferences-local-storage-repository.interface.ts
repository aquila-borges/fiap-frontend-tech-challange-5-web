import type { TaskPanelViewPreferences } from './task-panel-view-preferences.interface';

export interface TaskPanelViewPreferencesLocalStorageRepository {
  load(): Partial<TaskPanelViewPreferences>;
  save(preferences: TaskPanelViewPreferences): void;
}
