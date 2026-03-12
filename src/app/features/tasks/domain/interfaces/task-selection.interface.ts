import { Signal, WritableSignal } from '@angular/core';
import { Task } from '../index';

/**
 * Contract for managing task selection state.
 * Provides centralized control over single and multi-select operations.
 */
export interface TaskSelectionService {
  /**
   * Current set of selected task IDs
   */
  readonly selectedIds: Signal<Set<Task['id']>>;

  /**
   * Count of selected tasks
   */
  readonly selectedCount: Signal<number>;

  /**
   * Whether any tasks are selected
   */
  readonly hasSelected: Signal<boolean>;

  /**
   * Whether exactly one task is selected (can edit)
   */
  readonly canEdit: Signal<boolean>;

  /**
   * Whether multiple tasks are selected (can perform batch actions)
   */
  readonly hasMultipleSelected: Signal<boolean>;

  /**
   * Toggle selection of a single task
   */
  toggleSelection(taskId: Task['id']): void;

  /**
   * Select multiple tasks at once
   */
  selectMultiple(taskIds: Task['id'][]): void;

  /**
   * Clear all selections
   */
  clearSelection(): void;

  /**
   * Select only one task (clears previous selections)
   */
  selectOnly(taskId: Task['id']): void;

  /**
   * Get the first (or only) selected task ID, if any
   */
  getFirstSelectedId(): Task['id'] | null;
}
