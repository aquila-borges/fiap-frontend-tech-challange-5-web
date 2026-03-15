import { Signal } from '@angular/core';
import { TaskPanelSortOption, TaskPanelFilterOption } from '../index';

/**
 * Contract for managing task view preferences and UI state.
 * Persists user preferences across sessions (sort, filter, view mode, grid columns).
 */
export interface TaskPreferencesService {
  /**
   * Current sort option
   */
  readonly sortOption: Signal<TaskPanelSortOption>;

  /**
   * Current filter option
   */
  readonly filterOption: Signal<TaskPanelFilterOption>;

  /**
   * Whether to show list view (vs grid view)
   */
  readonly isListView: Signal<boolean>;

  /**
   * Number of grid columns (2-5)
   */
  readonly gridColumns: Signal<2 | 3 | 4 | 5>;

  /**
   * Current viewport width in pixels
   */
  readonly viewportWidth: Signal<number>;

  /**
   * Whether to use handwritten task font
   */
  readonly useHandwrittenTaskFont: Signal<boolean>;

  /**
   * Update sort option and persist preference
   */
  setSortOption(option: TaskPanelSortOption): void;

  /**
   * Update filter option and persist preference
   */
  setFilterOption(option: TaskPanelFilterOption): void;

  /**
   * Toggle between list and grid view, persist preference
   */
  toggleViewMode(): void;

  /**
   * Set number of grid columns, persist preference
   */
  setGridColumns(columns: 2 | 3 | 4 | 5): void;

  /**
   * Update viewport width (called on window resize)
   */
  setViewportWidth(width: number): void;

  /**
   * Toggle handwritten font usage, persist preference
   */
  toggleHandwrittenFont(): void;
}
