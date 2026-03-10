import { Injectable } from '@angular/core';
import { TaskPanelSortOption, TaskPanelViewPreferences } from '../domain/index';
import { TaskPanelViewPreferencesRepository } from '../domain/index';

const VALID_SORT_OPTIONS: TaskPanelSortOption[] = [
  'priority-high-to-low',
  'priority-low-to-high',
  'date-closest',
];

const TASK_PANEL_VIEW_STORAGE_KEYS = {
  isListView: 'task_panel_isListView',
  gridColumns: 'task_panel_gridColumns',
  useHandwrittenTaskFont: 'task_panel_useHandwrittenTaskFont',
  sortOption: 'task_panel_sortOption',
};

@Injectable({ providedIn: 'root' })
export class TaskPanelViewPreferencesLocalStorageRepositoryImpl
  implements TaskPanelViewPreferencesRepository
{
  load(): Partial<TaskPanelViewPreferences> {
    const result: Partial<TaskPanelViewPreferences> = {};

    const isListView = localStorage.getItem(TASK_PANEL_VIEW_STORAGE_KEYS.isListView);
    if (isListView !== null) {
      result.isListView = isListView === 'true';
    }

    const gridColumns = localStorage.getItem(TASK_PANEL_VIEW_STORAGE_KEYS.gridColumns);
    if (gridColumns !== null) {
      const parsed = parseInt(gridColumns, 10);
      if (([2, 3, 4, 5] as number[]).includes(parsed)) {
        result.gridColumns = parsed as TaskPanelViewPreferences['gridColumns'];
      }
    }

    const useHandwrittenTaskFont = localStorage.getItem(
      TASK_PANEL_VIEW_STORAGE_KEYS.useHandwrittenTaskFont
    );
    if (useHandwrittenTaskFont !== null) {
      result.useHandwrittenTaskFont = useHandwrittenTaskFont === 'true';
    }

    const sortOption = localStorage.getItem(TASK_PANEL_VIEW_STORAGE_KEYS.sortOption);
    if (sortOption !== null && (VALID_SORT_OPTIONS as string[]).includes(sortOption)) {
      result.sortOption = sortOption as TaskPanelSortOption;
    }

    return result;
  }

  save(preferences: TaskPanelViewPreferences): void {
    localStorage.setItem(
      TASK_PANEL_VIEW_STORAGE_KEYS.isListView,
      String(preferences.isListView)
    );
    localStorage.setItem(
      TASK_PANEL_VIEW_STORAGE_KEYS.gridColumns,
      String(preferences.gridColumns)
    );
    localStorage.setItem(
      TASK_PANEL_VIEW_STORAGE_KEYS.useHandwrittenTaskFont,
      String(preferences.useHandwrittenTaskFont)
    );
    localStorage.setItem(
      TASK_PANEL_VIEW_STORAGE_KEYS.sortOption,
      preferences.sortOption
    );
  }
}
