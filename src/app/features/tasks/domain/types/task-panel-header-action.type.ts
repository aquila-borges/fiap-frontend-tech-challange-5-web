import { TaskPanelFilterOption } from './task-panel-filter-option.type';
import { TaskPanelSortOption } from './task-panel-sort-option.type';

export type TaskPanelHeaderAction =
  | { type: 'clear-selection' }
  | { type: 'edit-selected' }
  | { type: 'delete-selected' }
  | { type: 'toggle-sort-dropdown' }
  | { type: 'close-sort-dropdown' }
  | { type: 'apply-sort-option'; option: TaskPanelSortOption }
  | { type: 'toggle-filter-dropdown' }
  | { type: 'close-filter-dropdown' }
  | { type: 'apply-filter-option'; option: TaskPanelFilterOption }
  | { type: 'set-list-view' }
  | { type: 'cycle-grid-columns' }
  | { type: 'toggle-task-card-font' };