import type { TaskPanelSortOption } from '../types/task-panel-sort-option.type';

export interface TaskPanelViewPreferences {
  isListView: boolean;
  gridColumns: 2 | 3 | 4 | 5;
  useHandwrittenTaskFont: boolean;
  sortOption: TaskPanelSortOption;
}
