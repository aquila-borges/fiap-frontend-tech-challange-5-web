import { inject, Injectable, computed, effect, signal } from '@angular/core';
import { Task } from '../../domain';
import { TaskSelectionService } from '../../domain/interfaces/task-selection.interface';
import {
  LoadLocalStorageTaskSelectionUseCase,
  SaveLocalStorageTaskSelectionUseCase,
} from '../../usecases';

@Injectable({
  providedIn: 'root',
})
export class TaskSelectionServiceImpl implements TaskSelectionService {
  private readonly loadLocalStorageTaskSelectionUseCase = inject(LoadLocalStorageTaskSelectionUseCase);
  private readonly saveLocalStorageTaskSelectionUseCase = inject(SaveLocalStorageTaskSelectionUseCase);
  private readonly _selectedIds = signal<Set<Task['id']>>(new Set());

  readonly selectedIds = this._selectedIds.asReadonly();
  readonly selectedCount = computed(() => this._selectedIds().size);
  readonly hasSelected = computed(() => this._selectedIds().size > 0);
  readonly canEdit = computed(() => this._selectedIds().size > 0);
  readonly hasMultipleSelected = computed(() => this._selectedIds().size > 1);

  constructor() {
    this.restoreSelectionFromLocalStorage();

    effect(() => {
      this.persistSelectionToLocalStorage(this._selectedIds());
    });
  }

  toggleSelection(taskId: Task['id']): void {
    this._selectedIds.update(current => {
      const newSet = new Set(current);
      if (newSet.has(taskId)) {
        newSet.delete(taskId);
      } else {
        newSet.add(taskId);
      }
      return newSet;
    });
  }

  selectMultiple(taskIds: Task['id'][]): void {
    this._selectedIds.set(new Set(taskIds));
  }

  clearSelection(): void {
    this._selectedIds.set(new Set());
  }

  selectOnly(taskId: Task['id']): void {
    this._selectedIds.set(new Set([taskId]));
  }

  private restoreSelectionFromLocalStorage(): void {
    const restoredIds = this.loadLocalStorageTaskSelectionUseCase.execute();
    this._selectedIds.set(new Set(restoredIds));
  }

  private persistSelectionToLocalStorage(selectedIds: Set<Task['id']>): void {
    this.saveLocalStorageTaskSelectionUseCase.execute(Array.from(selectedIds));
  }
}
