import { Task } from './task.interface';
import { TaskPageCursor } from './task-page-cursor.interface';

export interface TaskPageResult {
  tasks: Task[];
  nextCursor: TaskPageCursor | null;
  hasMore: boolean;
}
