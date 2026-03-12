import { inject, Injectable } from '@angular/core';
import {
  TaskPanelViewPreferences,
  TaskPanelViewPreferencesLocalStorageRepository,
} from '../domain';
import { TASK_PANEL_VIEW_PREFERENCES_LOCAL_STORAGE_REPOSITORY_TOKEN } from '../infrastructure';

@Injectable({
  providedIn: 'root'
})
export class LoadLocalStorageTaskPanelViewPreferencesUseCase {
  private readonly repository = inject<TaskPanelViewPreferencesLocalStorageRepository>(
    TASK_PANEL_VIEW_PREFERENCES_LOCAL_STORAGE_REPOSITORY_TOKEN
  );

  execute(): Partial<TaskPanelViewPreferences> {
    return this.repository.load();
  }
}
