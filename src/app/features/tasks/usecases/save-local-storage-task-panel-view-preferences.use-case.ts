import { inject, Injectable } from '@angular/core';
import {
  TaskPanelViewPreferences,
  TaskPanelViewPreferencesLocalStorageRepository,
} from '../domain';
import { TASK_PANEL_VIEW_PREFERENCES_LOCAL_STORAGE_REPOSITORY_TOKEN } from '../infrastructure';

@Injectable({
  providedIn: 'root'
})
export class SaveLocalStorageTaskPanelViewPreferencesUseCase {
  private readonly repository = inject<TaskPanelViewPreferencesLocalStorageRepository>(
    TASK_PANEL_VIEW_PREFERENCES_LOCAL_STORAGE_REPOSITORY_TOKEN
  );

  execute(preferences: TaskPanelViewPreferences): void {
    this.repository.save(preferences);
  }
}
