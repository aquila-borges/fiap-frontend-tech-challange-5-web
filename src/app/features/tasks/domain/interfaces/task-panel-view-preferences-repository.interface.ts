import type { TaskPanelViewPreferences } from './task-panel-view-preferences.interface';

export interface TaskPanelViewPreferencesRepository {
  load(): Partial<TaskPanelViewPreferences>;
  save(preferences: TaskPanelViewPreferences): void;
}
