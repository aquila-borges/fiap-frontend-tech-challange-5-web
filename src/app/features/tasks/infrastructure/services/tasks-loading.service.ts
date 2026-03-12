import { Injectable, signal } from '@angular/core';
import { TasksLoadingService } from '../../domain/interfaces/tasks-loading.interface';

@Injectable({
  providedIn: 'root',
})
export class TasksLoadingServiceImpl implements TasksLoadingService {
  private readonly _isLoadingTasks = signal(false);

  readonly isLoadingTasks = this._isLoadingTasks.asReadonly();

  setLoadingTasks(loading: boolean): void {
    this._isLoadingTasks.set(loading);
  }
}
