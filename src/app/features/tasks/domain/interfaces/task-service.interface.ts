import { Observable } from 'rxjs';
import { Task } from './task.interface';
import { TaskFormData } from './task-form-data.interface';

export interface TaskService {
  createTask(taskData: TaskFormData): Observable<Task>;
  getTasks(): Observable<Task[]>;
  getTaskById(id: string): Observable<Task>;
  updateTask(id: string, taskData: Partial<TaskFormData>): Observable<Task>;
  deleteTask(id: string): Observable<void>;
}
