import type { TaskPriority } from '../types/task-priority.type';
import type { TaskStatus } from '../types/task-status.type';

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  dueDate?: Date;
  status: TaskStatus;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  color?: string;
}
