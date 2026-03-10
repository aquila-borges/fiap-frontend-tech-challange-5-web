import type { TaskPriority } from '../types/task-priority.type';

export interface TaskFormData {
  title: string;
  description?: string;
  priority: TaskPriority;
  dueDate?: Date;
}
