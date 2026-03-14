import { Observable } from 'rxjs';
import { Task } from '../../../tasks';

export interface DashboardDialogs {
  openTaskFormDialog(task: Task | Task[]): Observable<Task | Task[] | undefined>;
  openDeleteSelectedTasksDialog(): Observable<boolean | undefined>;
  openPomodoroSelectedTasksDialog(): Observable<boolean | undefined>;
}
