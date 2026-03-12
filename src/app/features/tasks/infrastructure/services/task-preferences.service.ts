import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { TaskPanelSortOption, TaskPanelFilterOption, TaskPreferencesService, TaskPanelViewPreferencesRepository } from '../../domain';
import { TASK_PANEL_VIEW_PREFERENCES_REPOSITORY_TOKEN } from '../repositories/index';

@Injectable({
  providedIn: 'root',
})
export class TaskPreferencesServiceImpl implements TaskPreferencesService {
  private readonly preferencesRepository = inject<TaskPanelViewPreferencesRepository>(
    TASK_PANEL_VIEW_PREFERENCES_REPOSITORY_TOKEN
  );

  private readonly _sortOption = signal<TaskPanelSortOption>('priority-high-to-low');
  private readonly _filterOption = signal<TaskPanelFilterOption>('all');
  private readonly _isListView = signal(false);
  private readonly _gridColumns = signal<2 | 3 | 4 | 5>(5);
  private readonly _viewportWidth = signal(typeof window !== 'undefined' ? window.innerWidth : 1200);
  private readonly _useHandwrittenTaskFont = signal(true);

  readonly sortOption = this._sortOption.asReadonly();
  readonly filterOption = this._filterOption.asReadonly();
  readonly isListView = this._isListView.asReadonly();
  readonly gridColumns = this._gridColumns.asReadonly();
  readonly viewportWidth = this._viewportWidth.asReadonly();
  readonly useHandwrittenTaskFont = this._useHandwrittenTaskFont.asReadonly();

  constructor() {
    // Load preferences from localStorage on initialization
    const saved = this.preferencesRepository.load();
    if (saved.sortOption !== undefined) {
      this._sortOption.set(saved.sortOption);
    }
    if (saved.isListView !== undefined) {
      this._isListView.set(saved.isListView);
    }
    if (saved.gridColumns !== undefined) {
      this._gridColumns.set(saved.gridColumns);
    }
    if (saved.useHandwrittenTaskFont !== undefined) {
      this._useHandwrittenTaskFont.set(saved.useHandwrittenTaskFont);
    }

    // Auto-save preferences whenever they change
    effect(() => {
      this.preferencesRepository.save({
        sortOption: this._sortOption(),
        isListView: this._isListView(),
        gridColumns: this._gridColumns(),
        useHandwrittenTaskFont: this._useHandwrittenTaskFont(),
      });
    });
  }

  setSortOption(option: TaskPanelSortOption): void {
    this._sortOption.set(option);
  }

  setFilterOption(option: TaskPanelFilterOption): void {
    this._filterOption.set(option);
  }

  toggleViewMode(): void {
    this._isListView.update(current => !current);
  }

  setGridColumns(columns: 2 | 3 | 4 | 5): void {
    this._gridColumns.set(columns);
  }

  setViewportWidth(width: number): void {
    this._viewportWidth.set(width);
  }

  toggleHandwrittenFont(): void {
    this._useHandwrittenTaskFont.update(current => !current);
  }
}
