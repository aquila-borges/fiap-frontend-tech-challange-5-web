import { inject, Injectable } from '@angular/core';
import {
  TaskPanelViewPreferences,
  TaskPanelViewPreferencesRepository,
  TASK_PANEL_VIEW_PREFERENCES_REPOSITORY_TOKEN,
} from '../index';

@Injectable({
  providedIn: 'root',
})
export class SaveTaskPanelViewPreferencesUseCase {
  private readonly repository = inject<TaskPanelViewPreferencesRepository>(
    TASK_PANEL_VIEW_PREFERENCES_REPOSITORY_TOKEN
  );

  execute(preferences: TaskPanelViewPreferences): void {
    this.repository.save(preferences);
  }
}
