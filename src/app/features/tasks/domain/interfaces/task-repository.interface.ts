import { Observable } from 'rxjs';
import { Task } from './task.interface';
import { TaskFormData } from './task-form-data.interface';

export interface TaskRepository {
  createTask(task: Omit<Task, 'id'>): Observable<Task>;
  getTasksByUserId(userId: string): Observable<Task[]>;
  getTaskById(id: string, userId: string): Observable<Task>;
  updateTask(id: string, taskData: Partial<TaskFormData>, userId: string): Observable<Task>;
  deleteTask(id: string, userId: string): Observable<void>;
}