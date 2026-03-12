import { Injectable, computed, signal } from '@angular/core';
import { Task } from '../../domain';
import { TaskSelectionService } from '../../domain/interfaces/task-selection.interface';

@Injectable({
  providedIn: 'root',
})
export class TaskSelectionServiceImpl implements TaskSelectionService {
  private readonly _selectedIds = signal<Set<Task['id']>>(new Set());

  readonly selectedIds = this._selectedIds.asReadonly();
  readonly selectedCount = computed(() => this._selectedIds().size);
  readonly hasSelected = computed(() => this._selectedIds().size > 0);
  readonly canEdit = computed(() => this._selectedIds().size === 1);
  readonly hasMultipleSelected = computed(() => this._selectedIds().size > 1);

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

  getFirstSelectedId(): Task['id'] | null {
    const selected = this._selectedIds();
    return selected.size > 0 ? Array.from(selected)[0] : null;
  }
}
