import { Task } from './task.interface';

export interface TaskSelectionLocalStorageRepository {
  load(): Task['id'][];
  save(taskIds: Task['id'][]): void;
}
