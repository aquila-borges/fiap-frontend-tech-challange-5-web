import { Signal } from '@angular/core';

/**
 * Contract for managing loading and operation states for tasks.
 * Provides centralized tracking of async operations and loading indicators.
 */
export interface TasksLoadingService {
  /**
   * Whether tasks are being loaded from the backend
   */
  readonly isLoadingTasks: Signal<boolean>;

  /**
   * Whether tasks are being deleted
   */
  readonly isDeletingTasks: Signal<boolean>;

  /**
   * Whether any operation is in progress
   */
  readonly isOperationInProgress: Signal<boolean>;

  /**
   * Set loading state for initial task fetch
   */
  setLoadingTasks(loading: boolean): void;

  /**
   * Set loading state for task deletion
   */
  setDeletingTasks(deleting: boolean): void;
}
