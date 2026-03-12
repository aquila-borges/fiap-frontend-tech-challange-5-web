import { Observable } from 'rxjs';
import { Task } from '../../../tasks';

export interface DashboardDialogs {
  openTaskFormDialog(task: Task): Observable<Task | undefined>;
  openDeleteSelectedTasksDialog(): Observable<boolean | undefined>;
}
