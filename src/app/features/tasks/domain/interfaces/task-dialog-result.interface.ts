import { Task } from './task.interface';

export interface TaskDialogResult {
  task?: Task;
  cancelled: boolean;
}
