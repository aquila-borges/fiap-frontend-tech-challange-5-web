import { TaskPriority } from './task.interface';

export interface TaskFormData {
  title: string;
  description?: string;
  priority: TaskPriority;
  dueDate?: Date;
}
