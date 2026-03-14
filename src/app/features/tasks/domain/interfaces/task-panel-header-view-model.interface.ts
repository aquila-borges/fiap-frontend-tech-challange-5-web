import { TaskPanelFilterOption, TaskPanelSortOption } from '../types';

export interface TaskPanelHeaderViewModel {
  isPomodoroSelectMode: boolean;
  totalTasksCount: number;
  selectedTasksCount: number;
  pomodoroEstimatedFinishAtLabel: string | null;
  pomodoroEstimatedTotalHoursLabel: string | null;
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