import { Observable } from 'rxjs';
import { TaskDialogResult } from './task-dialog-result.interface';

export interface TaskDialogService {
  openCreateTaskDialog(): Observable<TaskDialogResult>;
}
