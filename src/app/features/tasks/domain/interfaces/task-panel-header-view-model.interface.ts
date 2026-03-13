import { TaskPanelFilterOption, TaskPanelSortOption } from '../types';

export interface TaskPanelHeaderViewModel {
  isPomodoroSelectMode: boolean;
  maxPomodoroTasks: number;
  selectedTasksCount: number;
  hasSelectedTasks: boolean;
  canEditSelectedTask: boolean;
  isSortDropdownOpen: boolean;
  isSortDropdownClosing: boolean;
  sortOption: TaskPanelSortOption;
  isFilterDropdownOpen: boolean;
  isFilterDropdownClosing: boolean;
  filterOption: TaskPanelFilterOption;
  hasActiveFilter: boolean;
  effectiveIsListView: boolean;
  isAccessibleFontEnabled: boolean;
  gridColumnsTooltip: string;
}