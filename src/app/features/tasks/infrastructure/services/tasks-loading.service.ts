import { Injectable, computed, signal } from '@angular/core';
import { TasksLoadingService } from '../../domain/interfaces/tasks-loading.interface';

@Injectable({
  providedIn: 'root',
})
export class TasksLoadingServiceImpl implements TasksLoadingService {
  private readonly _isLoadingTasks = signal(false);
  private readonly _isDeletingTasks = signal(false);

  readonly isLoadingTasks = this._isLoadingTasks.asReadonly();
  readonly isDeletingTasks = this._isDeletingTasks.asReadonly();
  readonly isOperationInProgress = computed(() => this._isLoadingTasks() || this._isDeletingTasks());

  setLoadingTasks(loading: boolean): void {
    this._isLoadingTasks.set(loading);
  }

  setDeletingTasks(deleting: boolean): void {
    this._isDeletingTasks.set(deleting);
  }
}
